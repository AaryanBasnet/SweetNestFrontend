import React, { useMemo, useRef } from "react";
import PropTypes from "prop-types";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import {
  SIZE_OPTIONS,
  FLAVOR_OPTIONS,
  COLOR_OPTIONS,
  TIER_OPTIONS,
  TOPPER_OPTIONS,
} from "./cakeConfigConstants";
 
/**
 * PHOTOREALISTIC CAKE MODEL
 * Based on professional food photography and PBR rendering techniques
 * Features: Subsurface scattering, procedural textures, warm lighting response
 */
 
// ============================================
// COLOR UTILITIES
// ============================================
 
/**
 * Adjusts color for food appeal using color psychology
 * Warm tones trigger appetite, higher saturation = more appealing
 */
const adjustColorForAppeal = (hexColor) => {
  try {
    const color = new THREE.Color(hexColor || "#FFFFFF");
    // Add warmth and saturation for appetizing appearance
    color.offsetHSL(0.02, 0.15, 0.05);
    return color;
  } catch {
    return new THREE.Color("#FFFFFF");
  }
};
 
/**
 * Creates a slightly darker shade for depth
 */
const createDarkerShade = (hexColor, amount = 0.15) => {
  try {
    const color = new THREE.Color(hexColor || "#FFFFFF");
    color.offsetHSL(0, 0.05, -amount);
    return color;
  } catch {
    return new THREE.Color("#CCCCCC");
  }
};
 
// ============================================
// PROCEDURAL TEXTURE GENERATION
// ============================================
 
/**
 * Creates frosting texture with subtle noise variation
 */
const createFrostingTexture = (baseColor) => {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
 
  const color = new THREE.Color(baseColor);
  const r = Math.floor(color.r * 255);
  const g = Math.floor(color.g * 255);
  const b = Math.floor(color.b * 255);
 
  // Fill with base color
  ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
  ctx.fillRect(0, 0, 256, 256);
 
  // Add subtle noise for frosting texture
  const imageData = ctx.getImageData(0, 0, 256, 256);
  const data = imageData.data;
 
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 16; // ±8% variation
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
 
  ctx.putImageData(imageData, 0, 0);
 
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
};
 
/**
 * Creates bump map for frosting surface detail
 */
const createBumpTexture = () => {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");
 
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 128, 128);
 
  // Add circular swirl patterns mimicking frosting application
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * 128;
    const y = Math.random() * 128;
    const radius = 5 + Math.random() * 15;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, "#909090");
    gradient.addColorStop(0.5, "#858585");
    gradient.addColorStop(1, "#808080");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
 
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};
 
// ============================================
// FROSTING MATERIAL WITH SSS
// ============================================
 
/**
 * Creates photorealistic frosting material with subsurface scattering
 */
function FrostingMaterial({ color, isTopSurface = false }) {
  const adjustedColor = useMemo(() => adjustColorForAppeal(color), [color]);
  const frostingTexture = useMemo(() => createFrostingTexture(color), [color]);
  const bumpTexture = useMemo(() => createBumpTexture(), []);
 
  return (
    <meshPhysicalMaterial
      color={adjustedColor}
      map={frostingTexture}
      bumpMap={bumpTexture}
      bumpScale={0.02}
      roughness={isTopSurface ? 0.2 : 0.25}
      metalness={0.02}
      // Subsurface scattering for realistic frosting
      transmission={0.03}
      thickness={1.2}
      ior={1.45}
      // Glossy finish
      clearcoat={isTopSurface ? 0.5 : 0.4}
      clearcoatRoughness={0.25}
      // Soft highlight (velvety appearance)
      sheen={0.3}
      sheenRoughness={0.8}
      sheenColor={new THREE.Color("#FFFFFF")}
      // Environment reflections
      reflectivity={0.3}
      envMapIntensity={0.9}
    />
  );
}
 
FrostingMaterial.propTypes = {
  color: PropTypes.string.isRequired,
  isTopSurface: PropTypes.bool,
};
 
// ============================================
// DECORATIVE PIPING
// ============================================
 
/**
 * Piping dots around cake edge
 */
function PipingDots({ radius, y, count, color, dotSize = 0.06 }) {
  const adjustedColor = useMemo(() => adjustColorForAppeal(color), [color]);
 
  return (
    <group position={[0, y, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <mesh key={i} position={[x, 0, z]} castShadow>
            <sphereGeometry args={[dotSize, 12, 12]} />
            <meshPhysicalMaterial
              color={adjustedColor}
              roughness={0.3}
              clearcoat={0.5}
              sheen={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}
 
PipingDots.propTypes = {
  radius: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  dotSize: PropTypes.number,
};
 
/**
 * Shell border swirls
 */
function ShellBorder({ radius, y, count, color }) {
  const adjustedColor = useMemo(() => adjustColorForAppeal(color), [color]);
 
  return (
    <group position={[0, y, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <group key={i} position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
            {/* Shell shape using elongated spheres */}
            <mesh position={[0, 0, 0]} scale={[1, 0.6, 1.5]} castShadow>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshPhysicalMaterial
                color={adjustedColor}
                roughness={0.3}
                clearcoat={0.4}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
 
ShellBorder.propTypes = {
  radius: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};
 
// ============================================
// CAKE TIER COMPONENT
// ============================================
 
function PhotorealisticTier({
  yPosition,
  radius,
  height,
  flavorColor,
  frostingColor,
  scale,
  isTopTier = false,
  tierIndex = 0,
}) {
  const adjustedFlavorColor = useMemo(
    () => createDarkerShade(flavorColor, 0.1),
    [flavorColor]
  );
 
  const scaledRadius = radius * scale;
  const pipingRadius = scaledRadius * 0.92;
 
  return (
    <group position={[0, yPosition, 0]}>
      {/* CAKE SPONGE (inner layer, slightly smaller) */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry
          args={[scaledRadius * 0.94, scaledRadius * 0.94, height * 0.95, 48]}
        />
        <meshStandardMaterial
          color={adjustedFlavorColor}
          roughness={0.85}
          metalness={0}
        />
      </mesh>
 
      {/* FROSTING LAYER (outer) */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[scaledRadius, scaledRadius, height, 48]} />
        <FrostingMaterial color={frostingColor} />
      </mesh>
 
      {/* TOP SURFACE with enhanced glossiness */}
      <mesh position={[0, height / 2 + 0.005, 0]} receiveShadow>
        <cylinderGeometry
          args={[scaledRadius * 0.98, scaledRadius * 0.98, 0.01, 48]}
        />
        <FrostingMaterial color={frostingColor} isTopSurface />
      </mesh>
 
      {/* DECORATIVE PIPING - Top edge */}
      <PipingDots
        radius={pipingRadius}
        y={height / 2}
        count={Math.floor(36 + tierIndex * -6)}
        color={frostingColor}
        dotSize={0.05}
      />
 
      {/* SHELL BORDER below top dots */}
      {isTopTier && (
        <ShellBorder
          radius={pipingRadius * 0.95}
          y={height / 2 - 0.08}
          count={18}
          color={frostingColor}
        />
      )}
 
      {/* BOTTOM BORDER */}
      <PipingDots
        radius={scaledRadius * 0.95}
        y={-height / 2 + 0.02}
        count={Math.floor(28 + tierIndex * -4)}
        color={frostingColor}
        dotSize={0.04}
      />
 
    </group>
  );
}
 
PhotorealisticTier.propTypes = {
  yPosition: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  flavorColor: PropTypes.string.isRequired,
  frostingColor: PropTypes.string.isRequired,
  scale: PropTypes.number.isRequired,
  isTopTier: PropTypes.bool,
  tierIndex: PropTypes.number,
};
 
// ============================================
// PHOTOREALISTIC TOPPINGS
// ============================================
 
/**
 * Realistic Strawberry with seeds and leaves
 */
function RealisticStrawberry({ position, scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      {/* Main berry body */}
      <mesh castShadow>
        <sphereGeometry args={[0.15, 24, 24]} />
        <meshPhysicalMaterial
          color="#C41E3A"
          roughness={0.2}
          metalness={0.05}
          clearcoat={0.9}
          sheen={0.3}
          sheenColor={new THREE.Color("#FF6B6B")}
        />
      </mesh>
      {/* Seeds (Fibonacci spiral placement) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / 12);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const x = 0.14 * Math.sin(phi) * Math.cos(theta);
        const y = 0.14 * Math.cos(phi);
        const z = 0.14 * Math.sin(phi) * Math.sin(theta);
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.012, 6, 6]} />
            <meshStandardMaterial color="#F5DEB3" roughness={0.6} />
          </mesh>
        );
      })}
      {/* Leaves */}
      {[0, 120, 240].map((angle, i) => (
        <mesh
          key={i}
          position={[0, 0.12, 0]}
          rotation={[0.3, (angle * Math.PI) / 180, 0]}
        >
          <coneGeometry args={[0.04, 0.08, 4]} />
          <meshStandardMaterial color="#228B22" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}
 
RealisticStrawberry.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  scale: PropTypes.number,
};
 
/**
 * Realistic Chocolate Curl
 */
function ChocolateCurl({ position, rotation }) {
  return (
    <mesh position={position} rotation={rotation || [0, Math.random() * Math.PI, 0]} castShadow>
      <boxGeometry args={[0.12, 0.03, 0.08]} />
      <meshPhysicalMaterial
        color="#3E2723"
        roughness={0.3}
        metalness={0.12}
        clearcoat={0.5}
      />
    </mesh>
  );
}
 
ChocolateCurl.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  rotation: PropTypes.arrayOf(PropTypes.number),
};
 
/**
 * Realistic Edible Flower
 */
function EdibleFlower({ position, petalColor = "#FFB6C1" }) {
  return (
    <group position={position}>
      {/* Petals */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 0.08;
        const z = Math.sin(angle) * 0.08;
        return (
          <mesh
            key={i}
            position={[x, 0, z]}
            rotation={[0.4, angle, 0]}
            scale={[1, 0.3, 1]}
          >
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshPhysicalMaterial
              color={petalColor}
              roughness={0.4}
              transmission={0.15}
              thickness={0.5}
            />
          </mesh>
        );
      })}
      {/* Center with pollen */}
      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          color="#FFD700"
          roughness={0.5}
          emissive="#FFD700"
          emissiveIntensity={0.1}
        />
      </mesh>
    </group>
  );
}
 
EdibleFlower.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  petalColor: PropTypes.string,
};
 
/**
 * French Macaron with proper "pied" detail
 */
function FrenchMacaron({ position, color }) {
  const adjustedColor = useMemo(() => adjustColorForAppeal(color), [color]);
 
  return (
    <group position={position}>
      {/* Top shell */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color={adjustedColor}
          roughness={0.4}
          sheen={0.3}
        />
      </mesh>
      {/* Pied (foot) - characteristic macaron ruffled edge */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.12, 0.11, 0.04, 24]} />
        <meshPhysicalMaterial
          color={adjustedColor}
          roughness={0.5}
        />
      </mesh>
      {/* Cream filling */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.03, 16]} />
        <meshStandardMaterial color="#FFFAF0" roughness={0.6} />
      </mesh>
      {/* Bottom shell */}
      <mesh position={[0, -0.06, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color={adjustedColor}
          roughness={0.4}
          sheen={0.3}
        />
      </mesh>
    </group>
  );
}
 
FrenchMacaron.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  color: PropTypes.string.isRequired,
};
 
/**
 * Birthday Candle with realistic flame
 */
function BirthdayCandle({ position }) {
  const flameRef = useRef();
 
  useFrame((state) => {
    if (flameRef.current) {
      // Flickering effect
      const flicker = Math.sin(state.clock.elapsedTime * 15) * 0.02;
      flameRef.current.scale.setScalar(1 + flicker);
    }
  });
 
  return (
    <group position={position}>
      {/* Candle body with wax SSS */}
      <mesh castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.4, 12]} />
        <meshPhysicalMaterial
          color="#FFF8DC"
          roughness={0.6}
          transmission={0.2}
          thickness={0.5}
        />
      </mesh>
      {/* Wax drips */}
      {[0, 120, 240].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos((angle * Math.PI) / 180) * 0.025,
            0.1 - i * 0.08,
            Math.sin((angle * Math.PI) / 180) * 0.025,
          ]}
          scale={[1, 1.5, 1]}
        >
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshPhysicalMaterial color="#FFF8DC" roughness={0.5} />
        </mesh>
      ))}
      {/* Wick */}
      <mesh position={[0, 0.22, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.05, 6]} />
        <meshStandardMaterial color="#2D2D2D" />
      </mesh>
      {/* Flame - layered for realism */}
      <group ref={flameRef} position={[0, 0.28, 0]}>
        {/* Outer flame (orange) */}
        <mesh>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#FF6600" transparent opacity={0.6} />
        </mesh>
        {/* Middle flame (yellow) */}
        <mesh position={[0, 0.01, 0]} scale={0.7}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#FFCC00" transparent opacity={0.8} />
        </mesh>
        {/* Inner flame (white-hot) */}
        <mesh position={[0, 0.015, 0]} scale={0.4}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshBasicMaterial color="#FFFFCC" />
        </mesh>
        {/* Point light for glow */}
        <pointLight intensity={0.5} distance={1} decay={2} color="#FFA500" />
      </group>
    </group>
  );
}
 
BirthdayCandle.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
};
 
/**
 * Cake Toppings Manager
 */
function PhotorealisticToppings({ type, config, scale, yOffset }) {
  const topperData = TOPPER_OPTIONS[type] || { items: [] };
  const items = topperData.items || [];
  const frostingColor = COLOR_OPTIONS[config.color] || "#FFFFFF";
 
  if (!items.length) return null;
 
  return (
    <group position={[0, yOffset + 0.05, 0]}>
      {items.map((item, i) => {
        const pos = item.pos || [0, 0, 0];
        const itemScale = (item.scale || 1) * scale;
 
        switch (item.type) {
          case "fruit":
            return (
              <RealisticStrawberry
                key={i}
                position={pos}
                scale={itemScale * 1.5}
              />
            );
          case "chocolate":
            return (
              <ChocolateCurl
                key={i}
                position={pos}
                rotation={item.rotation}
              />
            );
          case "flower":
            return (
              <EdibleFlower
                key={i}
                position={pos}
                petalColor={item.color || "#FFB6C1"}
              />
            );
          case "macaron":
            return (
              <FrenchMacaron
                key={i}
                position={pos}
                color={frostingColor}
              />
            );
          case "candle":
            return <BirthdayCandle key={i} position={pos} />;
          default:
            return null;
        }
      })}
    </group>
  );
}
 
PhotorealisticToppings.propTypes = {
  type: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  scale: PropTypes.number.isRequired,
  yOffset: PropTypes.number.isRequired,
};
 
// ============================================
// PROFESSIONAL CAKE BOARD
// ============================================
 
function ProfessionalCakeBoard({ radius }) {
  return (
    <group position={[0, -0.12, 0]}>
      {/* Main plate - ceramic/porcelain */}
      <mesh receiveShadow>
        <cylinderGeometry args={[radius * 1.2, radius * 1.15, 0.08, 48]} />
        <meshPhysicalMaterial
          color="#FAFAFA"
          roughness={0.15}
          metalness={0.35}
          clearcoat={1}
          reflectivity={0.9}
          envMapIntensity={1.8}
        />
      </mesh>
 
      {/* Outer gold rim */}
      <mesh position={[0, 0.035, 0]}>
        <torusGeometry args={[radius * 1.18, 0.015, 12, 48]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
 
      {/* Inner gold rim */}
      <mesh position={[0, 0.035, 0]}>
        <torusGeometry args={[radius * 1.05, 0.01, 12, 48]} />
        <meshStandardMaterial
          color="#D4AF37"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>
 
      {/* Decorative gold pattern dots */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const x = Math.cos(angle) * radius * 1.12;
        const z = Math.sin(angle) * radius * 1.12;
        return (
          <mesh key={i} position={[x, 0.04, z]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshStandardMaterial
              color="#D4AF37"
              metalness={0.95}
              roughness={0.1}
            />
          </mesh>
        );
      })}
 
      {/* Shadow catcher base */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[radius * 1.25, radius * 1.3, 0.02, 48]} />
        <meshStandardMaterial
          color="#E8E8E8"
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}
 
ProfessionalCakeBoard.propTypes = {
  radius: PropTypes.number.isRequired,
};
 
// ============================================
// MAIN PHOTOREALISTIC CAKE MODEL
// ============================================
 
export function PhotorealisticCakeModel({ config }) {
  const groupRef = useRef();
 
  // Gentle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.02;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
    }
  });
 
  // Extract configuration with defensive fallbacks
  const tierCount = TIER_OPTIONS[config.tiers]?.count || 1;
  const sizeMultiplier = SIZE_OPTIONS[config.size]?.scale || 1;
  const flavorColor = FLAVOR_OPTIONS[config.flavor]?.color || "#F5F5DC";
  const frostingColor = COLOR_OPTIONS[config.color] || "#FFFFFF";
 
  // Tier dimensions based on count
  const tierHeights = useMemo(() => {
    if (tierCount === 1) return [1.4];
    if (tierCount === 2) return [1.2, 1.0];
    return [1.1, 0.95, 0.8];
  }, [tierCount]);
 
  const tierRadii = useMemo(() => {
    if (tierCount === 1) return [1.6];
    if (tierCount === 2) return [1.9, 1.4];
    return [2.1, 1.6, 1.1];
  }, [tierCount]);
 
  const tierScales = useMemo(() => {
    if (tierCount === 1) return [1.0];
    if (tierCount === 2) return [1.0, 0.85];
    return [1.0, 0.85, 0.70];
  }, [tierCount]);
 
  // Calculate cumulative Y positions
  const tierPositions = useMemo(() => {
    const positions = [];
    let currentY = 0;
    for (let i = 0; i < tierCount; i++) {
      currentY += tierHeights[i] / 2;
      positions.push(currentY);
      currentY += tierHeights[i] / 2 + 0.05;
    }
    return positions;
  }, [tierCount, tierHeights]);
 
  const topY = tierPositions[tierCount - 1] + tierHeights[tierCount - 1] / 2;
 
  return (
    <group ref={groupRef} scale={sizeMultiplier}>
      {/* CAKE TIERS */}
      {Array.from({ length: tierCount }).map((_, i) => (
        <PhotorealisticTier
          key={`tier-${i}-${config.color}-${config.flavor}`}
          yPosition={tierPositions[i]}
          radius={tierRadii[i]}
          height={tierHeights[i]}
          flavorColor={flavorColor}
          frostingColor={frostingColor}
          scale={tierScales[i]}
          isTopTier={i === tierCount - 1}
          tierIndex={i}
        />
      ))}
 
      {/* TOPPINGS */}
      {config.topper && config.topper !== "None" && (
        <PhotorealisticToppings
          type={config.topper}
          config={config}
          scale={tierScales[tierCount - 1]}
          yOffset={topY}
        />
      )}
 
      {/* PROFESSIONAL CAKE BOARD */}
      {/* <ProfessionalCakeBoard radius={tierRadii[0]} /> */}
    </group>
  );
}
 
PhotorealisticCakeModel.propTypes = {
  config: PropTypes.shape({
    tiers: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    flavor: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    topper: PropTypes.string.isRequired,
    message: PropTypes.string,
  }).isRequired,
};
 
export default PhotorealisticCakeModel;