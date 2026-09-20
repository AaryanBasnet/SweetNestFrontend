import React, { useMemo, useRef } from "react";
import PropTypes from "prop-types";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// ============================================
// COLOR UTILITIES
// ============================================

/** Warms and slightly saturates a colour so frosting reads as appetising. */
export const adjustColorForAppeal = (hexColor) => {
  try {
    const color = new THREE.Color(hexColor || "#FFFFFF");
    const hsl = { h: 0, s: 0, l: 0 };
    color.getHSL(hsl);
    color.setHSL(hsl.h, Math.min(1, hsl.s * 1.08), Math.min(1, hsl.l * 0.985));
    return `#${color.getHexString()}`;
  } catch {
    return hexColor || "#FFFFFF";
  }
};

export const createDarkerShade = (hexColor, amount = 0.15) => {
  try {
    const color = new THREE.Color(hexColor || "#FFFFFF");
    const hsl = { h: 0, s: 0, l: 0 };
    color.getHSL(hsl);
    color.setHSL(hsl.h, hsl.s, Math.max(0, hsl.l * (1 - amount)));
    return `#${color.getHexString()}`;
  } catch {
    return hexColor || "#FFFFFF";
  }
};

// ============================================
// FROSTING MATERIAL - buttercream with a soft procedural bump
// ============================================

let bumpTexture = null;
const getBumpTexture = () => {
  if (bumpTexture || typeof document === "undefined") return bumpTexture;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, size, size);
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  // Soft knife-stroke smears
  for (let i = 0; i < 900; i++) {
    const x = rnd() * size;
    const y = rnd() * size;
    const w = 6 + rnd() * 26;
    const h = 2 + rnd() * 5;
    const g = 110 + rnd() * 60;
    ctx.fillStyle = `rgba(${g},${g},${g},0.35)`;
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, rnd() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  bumpTexture = tex;
  return tex;
};

export function FrostingMaterial({ color, isTopSurface = false }) {
  const bump = useMemo(() => getBumpTexture(), []);
  const tint = useMemo(() => adjustColorForAppeal(color), [color]);
  return (
    <meshPhysicalMaterial
      color={tint}
      roughness={isTopSurface ? 0.42 : 0.5}
      metalness={0}
      clearcoat={isTopSurface ? 0.2 : 0.12}
      clearcoatRoughness={0.5}
      sheen={0.35}
      sheenRoughness={0.8}
      sheenColor="#FFFFFF"
      bumpMap={bump || undefined}
      bumpScale={isTopSurface ? 0.004 : 0.008}
      envMapIntensity={0.7}
    />
  );
}
FrostingMaterial.propTypes = {
  color: PropTypes.string.isRequired,
  isTopSurface: PropTypes.bool,
};

// ============================================
// TOPPER PIECES - each sits on y = 0 at its own origin
// ============================================

/** Strawberry with seeds and a leafy calyx. */
export function RealisticStrawberry({ position, scale = 1 }) {
  const seeds = useMemo(() => {
    const out = [];
    for (let i = 0; i < 26; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / 26);
      const theta = i * 2.399963;
      const y = Math.cos(phi);
      if (y > 0.85) continue;
      out.push([Math.sin(phi) * Math.cos(theta) * 0.5, y * 0.62, Math.sin(phi) * Math.sin(theta) * 0.5]);
    }
    return out;
  }, []);
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.62, 0]} scale={[1, 1.28, 1]} castShadow>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshPhysicalMaterial color="#D8203F" roughness={0.35} clearcoat={0.6} clearcoatRoughness={0.3} />
      </mesh>
      {seeds.map((p, i) => (
        <mesh key={i} position={[p[0], p[1] + 0.62, p[2]]}>
          <sphereGeometry args={[0.035, 6, 6]} />
          <meshStandardMaterial color="#F6E27A" roughness={0.6} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[Math.cos((i / 5) * Math.PI * 2) * 0.22, 1.24, Math.sin((i / 5) * Math.PI * 2) * 0.22]}
          rotation={[Math.PI / 2.6, -(i / 5) * Math.PI * 2, 0]}
        >
          <coneGeometry args={[0.1, 0.36, 6]} />
          <meshStandardMaterial color="#3E8E41" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}
RealisticStrawberry.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  scale: PropTypes.number,
};

/** Curled chocolate shaving. */
export function ChocolateCurl({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.1, 0.03, 8, 16, Math.PI * 1.5]} />
        <meshPhysicalMaterial color="#3E2723" roughness={0.35} clearcoat={0.4} />
      </mesh>
      <mesh position={[0.05, 0.03, 0.06]} rotation={[0.3, 0.5, 0.2]} castShadow>
        <boxGeometry args={[0.16, 0.02, 0.06]} />
        <meshPhysicalMaterial color="#4E342E" roughness={0.4} />
      </mesh>
    </group>
  );
}
ChocolateCurl.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  rotation: PropTypes.arrayOf(PropTypes.number),
};

/** Five-petal sugar flower. */
export function EdibleFlower({ position, petalColor = "#FFB6C1" }) {
  return (
    <group position={position}>
      {[0, 1, 2, 3, 4].map((i) => {
        const a = (i / 5) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.12, 0.06, Math.sin(a) * 0.12]}
            rotation={[0, -a, 0]}
            scale={[1.5, 0.45, 1]}
            castShadow
          >
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshPhysicalMaterial color={petalColor} roughness={0.55} sheen={0.6} sheenColor="#FFFFFF" />
          </mesh>
        );
      })}
      <mesh position={[0, 0.09, 0]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshStandardMaterial color="#F9C74F" roughness={0.7} />
      </mesh>
    </group>
  );
}
EdibleFlower.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  petalColor: PropTypes.string,
};

/** French macaron tinted to the frosting colour. */
export function FrenchMacaron({ position, color }) {
  const shell = (
    <meshPhysicalMaterial color={color} roughness={0.75} sheen={0.5} sheenColor="#FFFFFF" />
  );
  return (
    <group position={position}>
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.17, 0.12, 24]} />
        {shell}
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 0.06, 24]} />
        <meshStandardMaterial color="#FFF3E0" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.24, 0]} castShadow>
        <cylinderGeometry args={[0.17, 0.2, 0.12, 24]} />
        {shell}
      </mesh>
    </group>
  );
}
FrenchMacaron.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  color: PropTypes.string.isRequired,
};

/** Striped birthday candle with a flickering flame. */
export function BirthdayCandle({ position, color = "#F8C8DC" }) {
  const flameRef = useRef();
  useFrame((state) => {
    if (!flameRef.current) return;
    const t = state.clock.elapsedTime;
    const f = 1 + Math.sin(t * 12 + position[0] * 5) * 0.08 + Math.sin(t * 25 + position[2] * 3) * 0.04;
    flameRef.current.scale.set(f, 1 / f + 0.1, f);
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.05, 0.6, 16]} />
        <meshPhysicalMaterial color={color} roughness={0.45} clearcoat={0.3} />
      </mesh>
      {[0.12, 0.3, 0.48].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.047, 0.047, 0.05, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[0, 0.63, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.07, 6]} />
        <meshStandardMaterial color="#2B1B12" />
      </mesh>
      <group ref={flameRef} position={[0, 0.72, 0]}>
        <mesh scale={[0.6, 1, 0.6]}>
          <sphereGeometry args={[0.06, 10, 10]} />
          <meshStandardMaterial color="#FFB300" emissive="#FF8A00" emissiveIntensity={1.6} transparent opacity={0.95} />
        </mesh>
        <mesh position={[0, -0.01, 0]} scale={[0.35, 0.6, 0.35]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#FFF6D5" emissive="#FFF1B8" emissiveIntensity={2} />
        </mesh>
      </group>
    </group>
  );
}
BirthdayCandle.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  color: PropTypes.string,
};
