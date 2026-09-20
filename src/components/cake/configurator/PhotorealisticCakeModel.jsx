import React, { useMemo, useRef, useLayoutEffect, useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Text3D, Center, Sparkles } from "@react-three/drei";
import pipingFont from "three/examples/fonts/helvetiker_bold.typeface.json";
import {
  SHAPE_OPTIONS,
  SIZE_OPTIONS,
  FLAVOR_OPTIONS,
  FILLING_OPTIONS,
  COLOR_OPTIONS,
  TIER_OPTIONS,
  TOPPER_OPTIONS,
  DRIP_OPTIONS,
} from "./cakeConfigConstants";
import {
  createDarkerShade,
  adjustColorForAppeal,
  FrostingMaterial,
  RealisticStrawberry,
  ChocolateCurl,
  EdibleFlower,
  FrenchMacaron,
  BirthdayCandle,
} from "./cakeParts";

// ============================================
// DETERMINISTIC RANDOMNESS
// ============================================

const seededRandom = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

// ============================================
// OUTLINES - every shape is a closed curve sampled by arc length.
// All decorations (piping, drips, pearls, gold leaf) walk this curve, so
// they work for round, heart and square cakes alike.
// ============================================

const OUTLINE_N = 192;
const FLAT = [-Math.PI / 2, 0, 0];

function resample(points, n) {
  const L = [0];
  for (let i = 1; i <= points.length; i++) {
    const a = points[i - 1];
    const b = points[i % points.length];
    L.push(L[i - 1] + Math.hypot(b.x - a.x, b.z - a.z));
  }
  const total = L[points.length];
  const out = [];
  let j = 0;
  for (let k = 0; k < n; k++) {
    const d = (k / n) * total;
    while (j < points.length - 1 && L[j + 1] < d) j++;
    const a = points[j];
    const b = points[(j + 1) % points.length];
    const seg = L[j + 1] - L[j] || 1;
    const u = (d - L[j]) / seg;
    out.push({ x: a.x + (b.x - a.x) * u, z: a.z + (b.z - a.z) * u });
  }
  return { pts: out, perimeter: total };
}

function buildOutline(shape) {
  const raw = [];
  if (shape === "Heart") {
    for (let i = 0; i < 400; i++) {
      const a = (i / 400) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(a), 3);
      const y = 13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a);
      raw.push({ x: x / 16, z: -(y + 2.5) / 16 });
    }
  } else if (shape === "Square") {
    const s = 0.9;
    const c = 0.24;
    const corners = [
      [s - c, s - c, 0],
      [-(s - c), s - c, Math.PI / 2],
      [-(s - c), -(s - c), Math.PI],
      [s - c, -(s - c), Math.PI * 1.5],
    ];
    raw.push({ x: s, z: 0 });
    corners.forEach(([cx, cz, a0]) => {
      for (let i = 0; i <= 12; i++) {
        const a = a0 + (i / 12) * (Math.PI / 2);
        raw.push({ x: cx + Math.cos(a) * c, z: cz + Math.sin(a) * c });
      }
    });
  } else {
    for (let i = 0; i < 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      raw.push({ x: Math.cos(a), z: Math.sin(a) });
    }
  }
  const { pts, perimeter } = resample(raw, OUTLINE_N);
  const normals = pts.map((p, i) => {
    const a = pts[(i - 1 + OUTLINE_N) % OUTLINE_N];
    const b = pts[(i + 1) % OUTLINE_N];
    let nx = b.z - a.z;
    let nz = -(b.x - a.x);
    const len = Math.hypot(nx, nz) || 1;
    nx /= len;
    nz /= len;
    if (nx * p.x + nz * p.z < 0) {
      nx = -nx;
      nz = -nz;
    }
    return { nx, nz };
  });
  // Slice wedge as a t-range of the outline, plus the matching angular sector
  const wedge = shape === "Heart" ? [0.31, 0.44] : [0.06, 0.19];
  const wedgeSector = shape === "Heart" ? [-0.05, 1.55] : [0.3, 1.25];
  return { shape, pts, normals, perimeter, wedge, wedgeSector };
}

const outlineAt = (outline, t) => {
  const f = (((t % 1) + 1) % 1) * OUTLINE_N;
  const i = Math.floor(f) % OUTLINE_N;
  const u = f - Math.floor(f);
  const a = outline.pts[i];
  const b = outline.pts[(i + 1) % OUTLINE_N];
  const n = outline.normals[i];
  return { x: a.x + (b.x - a.x) * u, z: a.z + (b.z - a.z) * u, nx: n.nx, nz: n.nz };
};

const inWedge = (outline, t, margin = 0) => {
  const tt = ((t % 1) + 1) % 1;
  return tt > outline.wedge[0] - margin && tt < outline.wedge[1] + margin;
};

const inWedgeSector = (outline, phi) => {
  const p = ((phi % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const [a, b] = outline.wedgeSector;
  return p > a && p < b;
};

// Shape path in the XY plane of an extrude that is later laid flat (rotation -90° on X)
function shapePath(outline, scale, wedge) {
  const pts = [];
  if (!wedge) {
    for (const p of outline.pts) pts.push(new THREE.Vector2(p.x * scale, -p.z * scale));
    return pts;
  }
  const [w0, w1] = outline.wedge;
  const i0 = Math.floor(w0 * OUTLINE_N);
  const i1 = Math.ceil(w1 * OUTLINE_N);
  for (let k = i1; k <= i0 + OUTLINE_N; k++) {
    const p = outline.pts[k % OUTLINE_N];
    pts.push(new THREE.Vector2(p.x * scale, -p.z * scale));
  }
  pts.push(new THREE.Vector2(0, 0));
  return pts;
}

const extrude = (shape, depth) =>
  new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 1 });

function makeSolid(outline, scale, depth, wedge) {
  return extrude(new THREE.Shape(shapePath(outline, scale, wedge)), depth);
}

function makeRing(outline, outerScale, innerScale, depth, wedge) {
  if (!wedge) {
    const s = new THREE.Shape(shapePath(outline, outerScale, false));
    s.holes.push(new THREE.Path(shapePath(outline, innerScale, false).reverse()));
    return extrude(s, depth);
  }
  const outer = shapePath(outline, outerScale, true);
  outer.pop();
  const inner = shapePath(outline, innerScale, true);
  inner.pop();
  return extrude(new THREE.Shape([...outer, ...inner.reverse()]), depth);
}

function useDisposable(factory, deps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const geos = useMemo(factory, deps);
  useEffect(
    () => () => {
      Object.values(geos).forEach((g) => {
        if (Array.isArray(g)) g.forEach((x) => x.geo?.dispose?.());
        else g?.dispose?.();
      });
    },
    [geos]
  );
  return geos;
}

// ============================================
// INSTANCING HELPER
// ============================================

function Instanced({ items, children, shadow = true }) {
  const ref = useRef();
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    items.forEach((it, i) => {
      dummy.position.set(...it.pos);
      dummy.rotation.set(...(it.rot || [0, 0, 0]));
      const s = it.scale ?? 1;
      if (Array.isArray(s)) dummy.scale.set(...s);
      else dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      if (it.color) mesh.setColorAt(i, color.set(it.color));
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [items]);

  if (!items.length) return null;
  return (
    <instancedMesh
      key={items.length}
      ref={ref}
      args={[null, null, items.length]}
      castShadow={shadow}
      receiveShadow={shadow}
      frustumCulled={false}
    >
      {children}
    </instancedMesh>
  );
}
Instanced.propTypes = {
  items: PropTypes.array.isRequired,
  children: PropTypes.node,
  shadow: PropTypes.bool,
};

// ============================================
// TIER - frosting shell + sponge/filling layers (visible when sliced)
// ============================================

const LAYER_FRACTIONS = [0.27, 0.065, 0.27, 0.065, 0.27];

function Tier({
  outline,
  radius,
  height,
  yPosition,
  frostingColor,
  spongeColor,
  fillingColor,
  sliced,
}) {
  const geos = useDisposable(() => {
    const layers = [];
    let y = 0.015;
    LAYER_FRACTIONS.forEach((f, i) => {
      const d = f * height;
      layers.push({ geo: makeSolid(outline, radius * 0.93, d, sliced), y, filling: i % 2 === 1 });
      y += d;
    });
    return {
      wall: makeRing(outline, radius, radius * 0.93, height, sliced),
      cap: makeSolid(outline, radius * 0.985, 0.012, sliced),
      layers,
    };
  }, [outline, radius, height, sliced]);

  const piping = useMemo(() => {
    const build = (scale, y, size, spacing) => {
      const count = Math.max(12, Math.round((outline.perimeter * radius * scale) / spacing));
      const items = [];
      for (let i = 0; i < count; i++) {
        const t = i / count;
        if (sliced && inWedge(outline, t, 0.004)) continue;
        const p = outlineAt(outline, t);
        items.push({ pos: [p.x * radius * scale, y, p.z * radius * scale], scale: size });
      }
      return items;
    };
    return {
      top: build(0.94, height, 0.05, 0.125),
      bottom: build(0.965, 0.035, 0.042, 0.11),
    };
  }, [outline, radius, height, sliced]);

  const pipingColor = useMemo(() => adjustColorForAppeal(frostingColor), [frostingColor]);
  const sponge = useMemo(() => createDarkerShade(spongeColor, 0.05), [spongeColor]);

  return (
    <group position={[0, yPosition - height / 2, 0]}>
      <mesh geometry={geos.wall} rotation={FLAT} castShadow receiveShadow>
        <FrostingMaterial color={frostingColor} />
      </mesh>
      <mesh geometry={geos.cap} rotation={FLAT} position={[0, height, 0]} receiveShadow>
        <FrostingMaterial color={frostingColor} isTopSurface />
      </mesh>
      {geos.layers.map((l, i) => (
        <mesh key={i} geometry={l.geo} rotation={FLAT} position={[0, l.y, 0]} castShadow>
          {l.filling ? (
            <meshPhysicalMaterial color={fillingColor} roughness={0.3} clearcoat={0.6} clearcoatRoughness={0.25} />
          ) : (
            <meshStandardMaterial color={sponge} roughness={0.95} />
          )}
        </mesh>
      ))}
      <Instanced items={piping.top}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshPhysicalMaterial color={pipingColor} roughness={0.3} clearcoat={0.5} sheen={0.2} />
      </Instanced>
      <Instanced items={piping.bottom}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshPhysicalMaterial color={pipingColor} roughness={0.3} clearcoat={0.5} sheen={0.2} />
      </Instanced>
    </group>
  );
}
Tier.propTypes = {
  outline: PropTypes.object.isRequired,
  radius: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  yPosition: PropTypes.number.isRequired,
  frostingColor: PropTypes.string.isRequired,
  spongeColor: PropTypes.string.isRequired,
  fillingColor: PropTypes.string.isRequired,
  sliced: PropTypes.bool,
};

// ============================================
// DRIP FINISH
// ============================================

function Drips({ outline, radius, y, color, sliced, seed, heavy }) {
  const data = useMemo(() => {
    const rnd = seededRandom(seed);
    const count = Math.round((outline.perimeter * radius) / (heavy ? 0.27 : 0.33));
    const bodies = [];
    const drops = [];
    for (let i = 0; i < count; i++) {
      const t = (i + rnd() * 0.5) / count;
      if (sliced && inWedge(outline, t, 0.012)) continue;
      const p = outlineAt(outline, t);
      const len = 0.12 + rnd() * 0.45;
      const w = 0.11 + rnd() * 0.09;
      const x = p.x * radius * 0.985 + p.nx * 0.015;
      const z = p.z * radius * 0.985 + p.nz * 0.015;
      bodies.push({ pos: [x, -len / 2 + 0.01, z], scale: [w, len, w] });
      drops.push({ pos: [x, -len - 0.01, z], scale: w * 1.15 });
    }
    return { bodies, drops };
  }, [outline, radius, sliced, seed, heavy]);

  const pool = useDisposable(
    () => ({ geo: makeRing(outline, radius * 1.015, radius * 0.86, 0.05, sliced) }),
    [outline, radius, sliced]
  );

  const material = (
    <meshPhysicalMaterial
      color={color}
      roughness={0.12}
      metalness={0.02}
      clearcoat={0.9}
      clearcoatRoughness={0.08}
    />
  );

  return (
    <group position={[0, y, 0]}>
      <mesh geometry={pool.geo} rotation={FLAT} position={[0, -0.02, 0]} castShadow>
        {material}
      </mesh>
      <Instanced items={data.bodies}>
        <cylinderGeometry args={[0.5, 0.36, 1, 10]} />
        {material}
      </Instanced>
      <Instanced items={data.drops}>
        <sphereGeometry args={[0.5, 12, 12]} />
        {material}
      </Instanced>
    </group>
  );
}
Drips.propTypes = {
  outline: PropTypes.object.isRequired,
  radius: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  sliced: PropTypes.bool,
  seed: PropTypes.number.isRequired,
  heavy: PropTypes.bool,
};

// ============================================
// TOP SURFACE PLANNER - decides where message, photo, toppers and candles go
// so nothing overlaps and nothing hangs over the edge (or the slice).
// ============================================

function planTop({ R, centerZ, outline, hasMessage, hasPhoto, topperKind, sliced }) {
  const zones = [];
  let message = null;
  if (hasMessage) {
    message = hasPhoto
      ? { x: 0, z: centerZ + 0.7 * R, maxWidth: 1.05 * R, sizeCap: 0.15 * R }
      : {
          x: 0,
          z: centerZ,
          maxWidth: (topperKind === "ring" ? 1.0 : 1.45) * R,
          sizeCap: 0.24 * R,
        };
    zones.push({ x: message.x, z: message.z, hw: message.maxWidth / 2 + 0.04, hh: message.sizeCap * 0.6 });
  }
  const photo = hasPhoto ? { x: 0, z: centerZ, r: 0.48 * R } : null;
  if (photo) zones.push({ x: photo.x, z: photo.z, r: photo.r + 0.04 });

  const frontBlocked = Boolean(message && hasPhoto);
  const angDiff = (a, b) => {
    const d = Math.abs(((a - b) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    return Math.min(d, Math.PI * 2 - d);
  };
  const allow = (phi, r) => {
    if (sliced && r > 0.3 * R && inWedgeSector(outline, phi)) return false;
    if (frontBlocked && angDiff(phi, Math.PI / 2) < 0.95) return false;
    return true;
  };
  const clear = (x, z, margin = 0) =>
    zones.every((zn) =>
      zn.r !== undefined
        ? Math.hypot(x - zn.x, z - zn.z) > zn.r + margin
        : Math.abs(x - zn.x) > zn.hw + margin || Math.abs(z - zn.z) > zn.hh + margin
    );
  return { R, centerZ, message, photo, allow, clear };
}

// ============================================
// TOPPERS
// ============================================

const MACARON_COLORS = ["#F8A5C2", "#A8E6CF", "#C9B6E4", "#FFF3A3", "#FFD3B6", "#B5E3F7"];

function Toppings({ type, kind, plan, topY, hasNumber }) {
  const { R, centerZ } = plan;
  const items = useMemo(() => {
    const rnd = seededRandom(type.length * 131 + 7);
    const out = [];
    const push = (phi, r, extra = {}) => {
      const x = Math.cos(phi) * r;
      const z = centerZ + Math.sin(phi) * r;
      if (!plan.allow(phi, r)) return;
      if (!plan.clear(x, z, 0.09 * R)) return;
      out.push({ x, z, ...extra });
    };
    if (kind === "ring") {
      for (let k = 0; k < 8; k++) push(Math.PI / 8 + (k * Math.PI) / 4, 0.8 * R);
    } else if (kind === "band") {
      const n = type === "Fresh Fruits" ? 12 : 14;
      let guard = 0;
      while (out.length < n && guard++ < 120) {
        push(rnd() * Math.PI * 2, (0.58 + rnd() * 0.28) * R, {
          rot: rnd() * Math.PI * 2,
          s: 0.8 + rnd() * 0.45,
        });
      }
    } else if (kind === "candles") {
      if (!plan.message && !plan.photo) {
        for (let k = 0; k < 5; k++) push((k * Math.PI * 2) / 5 + 0.3, 0.22 * R);
      } else {
        const arcR = hasNumber ? 0.82 * R : 0.66 * R;
        for (let k = -2; k <= 2; k++) push(Math.PI * 1.5 + (k * Math.PI) / 6, arcR);
      }
    }
    return out;
  }, [type, kind, plan, R, centerZ, hasNumber]);

  const s = THREE.MathUtils.clamp(R / 1.1, 0.7, 1.15);
  const origin = [0, 0, 0];

  return (
    <group position={[0, topY, 0]}>
      {items.map((it, i) => (
        <group key={i} position={[it.x, 0, it.z]} scale={s * (it.s || 1)} rotation={[0, it.rot || 0, 0]}>
          {type === "Fresh Fruits" && <RealisticStrawberry position={origin} scale={0.36} />}
          {type === "Chocolate Shavings" && <ChocolateCurl position={origin} rotation={[0, 0, 0]} />}
          {type === "Edible Flowers" && (
            <EdibleFlower position={origin} petalColor={i % 2 ? "#FFB6C1" : "#FFD9E1"} />
          )}
          {type === "Macarons" && (
            <FrenchMacaron position={origin} color={MACARON_COLORS[i % MACARON_COLORS.length]} />
          )}
          {type === "Candles" && <BirthdayCandle position={origin} />}
        </group>
      ))}
    </group>
  );
}
Toppings.propTypes = {
  type: PropTypes.string.isRequired,
  kind: PropTypes.string.isRequired,
  plan: PropTypes.object.isRequired,
  topY: PropTypes.number.isRequired,
  hasNumber: PropTypes.bool,
};

// ============================================
// PIPED MESSAGE (extruded icing letters)
// ============================================

function PipedMessage({ text, slot, topY, frostingColor }) {
  const icingColor = useMemo(() => {
    const c = new THREE.Color(frostingColor);
    const lum = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
    return lum > 0.6 ? "#4A2C2A" : "#FFFFFF";
  }, [frostingColor]);

  const clean = (text || "").trim();
  if (!clean || !slot) return null;
  const size = Math.min(slot.sizeCap, slot.maxWidth / (clean.length * 0.74));
  const depth = size * 0.28;

  return (
    <group position={[slot.x, topY, slot.z]} rotation={FLAT}>
      <Center front>
        <Text3D
          font={pipingFont}
          size={size}
          height={depth}
          curveSegments={8}
          bevelEnabled
          bevelThickness={depth * 0.45}
          bevelSize={size * 0.06}
          bevelSegments={4}
          letterSpacing={size * 0.04}
          castShadow
        >
          {clean}
          <meshPhysicalMaterial
            color={icingColor}
            roughness={0.32}
            clearcoat={0.7}
            clearcoatRoughness={0.2}
            sheen={0.4}
            sheenColor={icingColor}
          />
        </Text3D>
      </Center>
    </group>
  );
}
PipedMessage.propTypes = {
  text: PropTypes.string,
  slot: PropTypes.object,
  topY: PropTypes.number.isRequired,
  frostingColor: PropTypes.string.isRequired,
};

// ============================================
// NUMBER CANDLES (standing gold numerals with flames)
// ============================================

function NumberCandles({ text, R, topY, z }) {
  const flameRef = useRef();
  useFrame((state) => {
    if (!flameRef.current) return;
    const f = 1 + Math.sin(state.clock.elapsedTime * 11) * 0.08 + Math.sin(state.clock.elapsedTime * 23) * 0.04;
    flameRef.current.scale.set(f, 1 / f + 0.1, f);
  });
  const digits = text.split("");
  const size = Math.min(0.34 * R, (0.95 * R) / Math.max(digits.length, 1));
  const depth = size * 0.22;
  const adv = size * 0.78;

  return (
    <group position={[0, topY, z]}>
      <Center top>
        <Text3D
          font={pipingFont}
          size={size}
          height={depth}
          curveSegments={8}
          bevelEnabled
          bevelSize={size * 0.03}
          bevelThickness={depth * 0.3}
          bevelSegments={3}
          letterSpacing={size * 0.08}
          castShadow
        >
          {text}
          <meshStandardMaterial color="#E8B923" metalness={0.9} roughness={0.25} />
        </Text3D>
      </Center>
      <group ref={flameRef}>
        {digits.map((_, i) => {
          const x = (i - (digits.length - 1) / 2) * adv;
          return (
            <group key={i} position={[x, size * 0.74, 0]}>
              <mesh position={[0, 0.03, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.06, 6]} />
                <meshStandardMaterial color="#2B1B12" />
              </mesh>
              <mesh position={[0, 0.1, 0]} scale={[0.6, 1, 0.6]}>
                <sphereGeometry args={[size * 0.13, 10, 10]} />
                <meshStandardMaterial color="#FFB300" emissive="#FF8A00" emissiveIntensity={1.6} />
              </mesh>
              <mesh position={[0, 0.085, 0]} scale={[0.35, 0.6, 0.35]}>
                <sphereGeometry args={[size * 0.13, 8, 8]} />
                <meshStandardMaterial color="#FFF6D5" emissive="#FFF1B8" emissiveIntensity={2} />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
}
NumberCandles.propTypes = {
  text: PropTypes.string.isRequired,
  R: PropTypes.number.isRequired,
  topY: PropTypes.number.isRequired,
  z: PropTypes.number.isRequired,
};

// ============================================
// EDIBLE PHOTO PRINT
// ============================================

function PhotoPrint({ url, x, z, r, topY }) {
  const [tex, setTex] = useState(null);
  useEffect(() => {
    let alive = true;
    new THREE.TextureLoader().load(url, (t) => {
      if (!alive) {
        t.dispose();
        return;
      }
      t.colorSpace = THREE.SRGBColorSpace;
      const { width: w, height: h } = t.image;
      if (w > h) {
        t.repeat.set(h / w, 1);
        t.offset.set((1 - h / w) / 2, 0);
      } else {
        t.repeat.set(1, w / h);
        t.offset.set(0, (1 - w / h) / 2);
      }
      t.anisotropy = 4;
      setTex(t);
    });
    return () => {
      alive = false;
    };
  }, [url]);
  useEffect(() => () => tex?.dispose(), [tex]);

  return (
    <group position={[x, topY, z]} rotation={FLAT}>
      <mesh position={[0, 0, 0.003]} receiveShadow>
        <circleGeometry args={[r * 1.08, 64]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
      </mesh>
      {tex && (
        <mesh position={[0, 0, 0.006]}>
          <circleGeometry args={[r, 64]} />
          <meshStandardMaterial map={tex} roughness={0.55} />
        </mesh>
      )}
    </group>
  );
}
PhotoPrint.propTypes = {
  url: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  z: PropTypes.number.isRequired,
  r: PropTypes.number.isRequired,
  topY: PropTypes.number.isRequired,
};

// ============================================
// FINISHING TOUCHES (instanced scatter)
// ============================================

const SPRINKLE_COLORS = ["#FF5C8A", "#FFB800", "#3FB6FF", "#7ED957", "#FF7A00", "#C77DFF", "#FFFFFF"];

function FinishScatter({ type, outline, tiers, plan, sliced }) {
  const top = tiers[tiers.length - 1];
  const { R, centerZ } = plan;

  const items = useMemo(() => {
    const rnd = seededRandom(type.length * 977 + tiers.length * 31 + 3);
    const list = [];
    const surfaceY = top.topY + 0.012;
    const scatterTop = (n, make, maxTries) => {
      let guard = 0;
      while (list.length < n && guard++ < maxTries) {
        const phi = rnd() * Math.PI * 2;
        const r = Math.sqrt(rnd()) * R * 0.9;
        if (!plan.allow(phi, r)) continue;
        const x = Math.cos(phi) * r;
        const z = centerZ + Math.sin(phi) * r;
        if (!plan.clear(x, z, 0.02)) continue;
        list.push(make(x, z));
      }
    };

    if (type === "Rainbow Sprinkles") {
      scatterTop(
        150,
        (x, z) => ({
          pos: [x, surfaceY + 0.014, z],
          rot: [0, rnd() * Math.PI, Math.PI / 2],
          scale: 0.8 + rnd() * 0.5,
          color: SPRINKLE_COLORS[Math.floor(rnd() * SPRINKLE_COLORS.length)],
        }),
        700
      );
    } else if (type === "Gold Leaf") {
      scatterTop(
        18,
        (x, z) => ({
          pos: [x, surfaceY + 0.005, z],
          rot: [(rnd() - 0.5) * 0.25, rnd() * Math.PI, (rnd() - 0.5) * 0.25],
          scale: 0.6 + rnd() * 0.8,
          color: "#E8B923",
        }),
        200
      );
      tiers.forEach((t) => {
        for (let i = 0; i < 9; i++) {
          const tt = rnd();
          if (sliced && inWedge(outline, tt, 0.02)) continue;
          const p = outlineAt(outline, tt);
          const y = t.topY - 0.08 - rnd() * t.height * 0.55;
          list.push({
            pos: [p.x * t.radius + p.nx * 0.004, y, p.z * t.radius + p.nz * 0.004],
            rot: [0, Math.atan2(p.nz, -p.nx), Math.PI / 2 + (rnd() - 0.5) * 0.3],
            scale: 0.5 + rnd() * 0.7,
            color: "#E8B923",
          });
        }
      });
    } else if (type === "Edible Pearls") {
      tiers.forEach((t) => {
        const count = Math.round((outline.perimeter * (t.radius + 0.035)) / 0.105);
        for (let i = 0; i < count; i++) {
          const tt = i / count;
          if (sliced && inWedge(outline, tt, 0.004)) continue;
          const p = outlineAt(outline, tt);
          list.push({
            pos: [p.x * t.radius + p.nx * 0.045, t.bottomY + 0.05, p.z * t.radius + p.nz * 0.045],
            scale: 1,
            color: "#F7F2EA",
          });
        }
      });
    }
    return list;
  }, [type, outline, tiers, plan, sliced, top, R, centerZ]);

  return (
    <Instanced items={items}>
      {type === "Rainbow Sprinkles" && <capsuleGeometry args={[0.014, 0.07, 3, 6]} />}
      {type === "Gold Leaf" && <boxGeometry args={[0.16, 0.004, 0.11]} />}
      {type === "Edible Pearls" && <sphereGeometry args={[0.048, 14, 14]} />}
      {type === "Gold Leaf" ? (
        <meshStandardMaterial color="#FFFFFF" metalness={1} roughness={0.28} side={THREE.DoubleSide} />
      ) : (
        <meshPhysicalMaterial
          color="#FFFFFF"
          roughness={type === "Edible Pearls" ? 0.12 : 0.35}
          clearcoat={1}
          clearcoatRoughness={0.1}
          iridescence={type === "Edible Pearls" ? 0.7 : 0}
          iridescenceIOR={1.3}
        />
      )}
    </Instanced>
  );
}
FinishScatter.propTypes = {
  type: PropTypes.string.isRequired,
  outline: PropTypes.object.isRequired,
  tiers: PropTypes.array.isRequired,
  plan: PropTypes.object.isRequired,
  sliced: PropTypes.bool,
};

// ============================================
// CAKE STAND
// ============================================

function CakeStand({ radius }) {
  const porcelain = (
    <meshPhysicalMaterial
      color="#FBF8F3"
      roughness={0.18}
      clearcoat={1}
      clearcoatRoughness={0.08}
      envMapIntensity={1.4}
    />
  );
  return (
    <group>
      <mesh position={[0, -0.04, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[radius, radius * 0.96, 0.08, 64]} />
        {porcelain}
      </mesh>
      <mesh position={[0, 0.005, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius - 0.02, 0.018, 12, 96]} />
        <meshStandardMaterial color="#D9B44A" metalness={1} roughness={0.22} />
      </mesh>
      <mesh position={[0, -0.43, 0]} castShadow>
        <cylinderGeometry args={[radius * 0.22, radius * 0.3, 0.7, 48]} />
        {porcelain}
      </mesh>
      <mesh position={[0, -0.81, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[radius * 0.62, radius * 0.7, 0.06, 64]} />
        {porcelain}
      </mesh>
    </group>
  );
}
CakeStand.propTypes = { radius: PropTypes.number.isRequired };

// ============================================
// MAIN MODEL
// ============================================

export function PhotorealisticCakeModel({ config, sliced = false }) {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.015;
    }
  });

  const shape = SHAPE_OPTIONS[config.shape] ? config.shape : "Round";
  const shapeOpt = SHAPE_OPTIONS[shape];
  const outline = useMemo(() => buildOutline(shape), [shape]);

  const tierCount = TIER_OPTIONS[config.tiers]?.count || 1;
  const sizeMultiplier = SIZE_OPTIONS[config.size]?.scale || 1;
  const spongeColor = FLAVOR_OPTIONS[config.flavor]?.color || "#F5F5DC";
  const fillingColor = FILLING_OPTIONS[config.filling]?.color || "#FFF4D6";
  const frostingColor = COLOR_OPTIONS[config.color] || "#FFFFFF";
  const drip = DRIP_OPTIONS[config.drip] || DRIP_OPTIONS.None;

  const tiers = useMemo(() => {
    const heights = tierCount === 1 ? [1.4] : tierCount === 2 ? [1.2, 1.0] : [1.1, 0.95, 0.8];
    const radii = tierCount === 1 ? [1.6] : tierCount === 2 ? [1.9, 1.4] : [2.1, 1.6, 1.1];
    const scales = tierCount === 1 ? [1] : tierCount === 2 ? [1, 0.85] : [1, 0.85, 0.7];
    let y = 0;
    return heights.map((h, i) => {
      const center = y + h / 2;
      y += h + 0.03;
      return {
        radius: radii[i] * scales[i],
        height: h,
        y: center,
        bottomY: center - h / 2,
        topY: center + h / 2,
      };
    });
  }, [tierCount]);

  const top = tiers[tierCount - 1];
  const surfaceY = top.topY + 0.012;
  const R = top.radius * shapeOpt.inner;
  const centerZ = shapeOpt.centerZ * top.radius;

  const hasMessage = Boolean((config.message || "").trim());
  const hasPhoto = Boolean(config.photo);
  const topperKind = TOPPER_OPTIONS[config.topper]?.kind || "none";
  const candleNumber = (config.candleNumber || "").replace(/\D/g, "").slice(0, 2);
  const hasNumber = candleNumber.length > 0;

  const plan = useMemo(
    () => planTop({ R, centerZ, outline, hasMessage, hasPhoto, topperKind, sliced }),
    [R, centerZ, outline, hasMessage, hasPhoto, topperKind, sliced]
  );

  const numberZ = centerZ - (hasPhoto ? 0.66 : hasMessage ? 0.4 : 0.14) * R;

  return (
    <group ref={groupRef} scale={sizeMultiplier}>
      <Sparkles
        count={40}
        scale={[tiers[0].radius * 2.8, top.topY + 1.5, tiers[0].radius * 2.8]}
        position={[0, (top.topY + 0.5) / 2, 0]}
        size={2.5}
        speed={0.25}
        opacity={0.45}
        color="#FFF3C4"
      />

      {tiers.map((t, i) => (
        <Tier
          key={`${shape}-${i}`}
          outline={outline}
          radius={t.radius}
          height={t.height}
          yPosition={t.y}
          frostingColor={frostingColor}
          spongeColor={spongeColor}
          fillingColor={fillingColor}
          sliced={sliced}
        />
      ))}

      {drip.color &&
        tiers.map((t, i) => (
          <Drips
            key={`drip-${shape}-${i}`}
            outline={outline}
            radius={t.radius}
            y={t.topY}
            color={drip.color}
            sliced={sliced}
            seed={101 + i * 17}
            heavy={i === 0}
          />
        ))}

      {topperKind !== "none" && (
        <Toppings
          type={config.topper}
          kind={topperKind}
          plan={plan}
          topY={surfaceY}
          hasNumber={hasNumber}
        />
      )}

      {config.finish && config.finish !== "None" && (
        <FinishScatter type={config.finish} outline={outline} tiers={tiers} plan={plan} sliced={sliced} />
      )}

      {hasPhoto && plan.photo && (
        <PhotoPrint url={config.photo} x={plan.photo.x} z={plan.photo.z} r={plan.photo.r} topY={surfaceY} />
      )}

      {hasMessage && (
        <PipedMessage text={config.message} slot={plan.message} topY={surfaceY + 0.002} frostingColor={frostingColor} />
      )}

      {hasNumber && <NumberCandles text={candleNumber} R={R} topY={surfaceY} z={numberZ} />}

      <CakeStand radius={tiers[0].radius * (shape === "Round" ? 1.22 : 1.3)} />
    </group>
  );
}

PhotorealisticCakeModel.propTypes = {
  config: PropTypes.shape({
    shape: PropTypes.string,
    tiers: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    flavor: PropTypes.string.isRequired,
    filling: PropTypes.string,
    color: PropTypes.string.isRequired,
    topper: PropTypes.string.isRequired,
    drip: PropTypes.string,
    finish: PropTypes.string,
    candleNumber: PropTypes.string,
    message: PropTypes.string,
    photo: PropTypes.string,
  }).isRequired,
  sliced: PropTypes.bool,
};

export default PhotorealisticCakeModel;
