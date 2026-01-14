import React, { useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  SIZE_OPTIONS,
  FLAVOR_OPTIONS,
  COLOR_OPTIONS,
  TIER_OPTIONS,
  TOPPER_OPTIONS,
} from "./cakeConfigConstants";

/**
 * Enhanced CakeTier with realistic details
 */
function EnhancedCakeTier({
  yPosition,
  radius,
  height,
  flavorColor,
  frostingColor,
  scale,
  isTopTier = false,
}) {
  // Create subtle texture using noise
  const bumpScale = 0.02;

  return (
    <group position={[0, yPosition, 0]}>
      {/* Cake Sponge Base */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry
          args={[radius * 0.98 * scale, radius * 0.98 * scale, height * 0.95, 64]}
        />
        <meshStandardMaterial
          color={flavorColor}
          roughness={0.8}
          metalness={0.0}
          bumpScale={bumpScale}
        />
      </mesh>

      {/* Main Frosting Layer */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius * scale, radius * scale, height, 64]} />
        <meshPhysicalMaterial
          color={frostingColor}
          roughness={0.3}
          metalness={0.05}
          clearcoat={0.5}
          clearcoatRoughness={0.2}
          reflectivity={0.3}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* Decorative Piping Border - Top */}
      {isTopTier && (
        <>
          {/* Top border piping */}
          <mesh position={[0, height / 2 + 0.03, 0]} castShadow>
            <torusGeometry args={[radius * scale * 0.96, 0.04, 16, 64]} />
            <meshPhysicalMaterial
              color={frostingColor}
              roughness={0.2}
              metalness={0.1}
              clearcoat={0.7}
            />
          </mesh>

          {/* Decorative pearls on top border */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i / 24) * Math.PI * 2;
            const x = Math.cos(angle) * radius * scale * 0.96;
            const z = Math.sin(angle) * radius * scale * 0.96;
            return (
              <mesh
                key={i}
                position={[x, height / 2 + 0.06, z]}
                castShadow
              >
                <sphereGeometry args={[0.025, 16, 16]} />
                <meshPhysicalMaterial
                  color={frostingColor}
                  roughness={0.15}
                  metalness={0.1}
                  clearcoat={0.8}
                  clearcoatRoughness={0.1}
                />
              </mesh>
            );
          })}
        </>
      )}

      {/* Bottom border piping */}
      <mesh position={[0, -height / 2 - 0.02, 0]} castShadow>
        <torusGeometry args={[radius * scale * 0.96, 0.03, 16, 64]} />
        <meshPhysicalMaterial
          color={frostingColor}
          roughness={0.25}
          metalness={0.05}
          clearcoat={0.6}
        />
      </mesh>

      {/* Subtle frosting texture on sides */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry
          args={[radius * scale * 1.001, radius * scale * 1.001, height * 0.98, 64]}
        />
        <meshStandardMaterial
          color={frostingColor}
          roughness={0.35}
          metalness={0.05}
          transparent
          opacity={0.3}
          bumpScale={0.01}
        />
      </mesh>

      {/* Top frosting surface */}
      <mesh position={[0, height / 2 + 0.005, 0]} receiveShadow>
        <cylinderGeometry
          args={[radius * scale * 0.95, radius * scale * 0.95, 0.01, 64]}
        />
        <meshPhysicalMaterial
          color={frostingColor}
          roughness={0.25}
          metalness={0.1}
          clearcoat={0.6}
          clearcoatRoughness={0.15}
        />
      </mesh>
    </group>
  );
}

EnhancedCakeTier.propTypes = {
  yPosition: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  flavorColor: PropTypes.string.isRequired,
  frostingColor: PropTypes.string.isRequired,
  scale: PropTypes.number.isRequired,
  isTopTier: PropTypes.bool,
};

/**
 * Enhanced Toppings with better visuals
 */
function EnhancedToppings({ type, config, scale, yOffset }) {
  const topperData = TOPPER_OPTIONS[type] || { items: [] };
  const items = topperData.items;
  const frostingColor = COLOR_OPTIONS[config.color];

  return (
    <group position={[0, yOffset + 0.08, 0]}>
      {items.map((item, i) => {
        // Fresh Fruits - realistic berries
        if (item.type === "fruit") {
          const colors = ["#C21E56", "#8B0000", "#FF4500", "#DC143C"];
          const color = colors[i % colors.length];
          return (
            <group key={i} position={item.pos}>
              {/* Berry body */}
              <mesh castShadow>
                <sphereGeometry args={[item.scale * scale, 16, 16]} />
                <meshPhysicalMaterial
                  color={color}
                  roughness={0.15}
                  clearcoat={0.8}
                  clearcoatRoughness={0.1}
                  envMapIntensity={1.2}
                />
              </mesh>
              {/* Strawberry seeds */}
              {Array.from({ length: 8 }).map((_, j) => {
                const theta = (j / 8) * Math.PI * 2;
                const phi = Math.PI / 3;
                const r = item.scale * scale * 0.9;
                return (
                  <mesh
                    key={j}
                    position={[
                      r * Math.sin(phi) * Math.cos(theta),
                      r * Math.cos(phi),
                      r * Math.sin(phi) * Math.sin(theta),
                    ]}
                  >
                    <sphereGeometry args={[0.015, 8, 8]} />
                    <meshStandardMaterial color="#FFFF00" roughness={0.6} />
                  </mesh>
                );
              })}
              {/* Leaf */}
              <mesh position={[0, item.scale * scale, 0]} rotation={[0.3, 0, 0]}>
                <coneGeometry args={[item.scale * scale * 0.3, 0.1, 4]} />
                <meshStandardMaterial color="#228B22" roughness={0.5} />
              </mesh>
            </group>
          );
        }

        // Chocolate shavings
        if (item.type === "chocolate") {
          return (
            <mesh
              key={i}
              position={item.pos}
              rotation={[
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI,
              ]}
              castShadow
            >
              <boxGeometry
                args={[
                  item.scale * scale * 0.8,
                  item.scale * scale * 0.2,
                  item.scale * scale * 0.4,
                ]}
              />
              <meshPhysicalMaterial
                color="#3E2723"
                roughness={0.25}
                metalness={0.15}
                clearcoat={0.4}
              />
            </mesh>
          );
        }

        // Edible flowers - more realistic
        if (item.type === "flower") {
          return (
            <group key={i} position={item.pos} scale={[scale, scale, scale]}>
              {/* Petals */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((petal) => {
                const angle = (petal / 8) * Math.PI * 2;
                return (
                  <mesh
                    key={petal}
                    position={[
                      Math.cos(angle) * 0.12,
                      0.02,
                      Math.sin(angle) * 0.12,
                    ]}
                    rotation={[0.3, angle, 0]}
                  >
                    <sphereGeometry args={[0.08, 12, 12, 0, Math.PI]} />
                    <meshPhysicalMaterial
                      color="#FFB7C5"
                      roughness={0.3}
                      clearcoat={0.3}
                      side={THREE.DoubleSide}
                    />
                  </mesh>
                );
              })}
              {/* Center */}
              <mesh position={[0, 0.04, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
                <meshStandardMaterial color="#FFD700" roughness={0.4} />
              </mesh>
              {/* Pollen dots */}
              {Array.from({ length: 12 }).map((_, j) => {
                const angle = (j / 12) * Math.PI * 2;
                return (
                  <mesh
                    key={`pollen-${j}`}
                    position={[
                      Math.cos(angle) * 0.03,
                      0.05,
                      Math.sin(angle) * 0.03,
                    ]}
                  >
                    <sphereGeometry args={[0.008, 8, 8]} />
                    <meshStandardMaterial color="#FFA500" roughness={0.3} />
                  </mesh>
                );
              })}
            </group>
          );
        }

        // Macarons - more detailed
        if (item.type === "macaron") {
          return (
            <group key={i} position={item.pos} scale={[scale, scale, scale]}>
              {/* Bottom shell */}
              <mesh position={[0, 0.03, 0]} castShadow>
                <sphereGeometry args={[item.scale, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshPhysicalMaterial
                  color={frostingColor}
                  roughness={0.35}
                  metalness={0.05}
                  clearcoat={0.2}
                />
              </mesh>
              {/* Filling */}
              <mesh position={[0, 0.08, 0]}>
                <cylinderGeometry args={[item.scale * 0.85, item.scale * 0.85, 0.03, 32]} />
                <meshStandardMaterial color="#FFFAF0" roughness={0.6} />
              </mesh>
              {/* Top shell */}
              <mesh position={[0, 0.13, 0]} castShadow rotation={[Math.PI, 0, 0]}>
                <sphereGeometry args={[item.scale, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshPhysicalMaterial
                  color={frostingColor}
                  roughness={0.35}
                  metalness={0.05}
                  clearcoat={0.2}
                />
              </mesh>
            </group>
          );
        }

        // Birthday candles
        if (item.type === "candle") {
          return (
            <group key={i} position={item.pos} scale={[scale, scale, scale]}>
              {/* Candle body with stripes */}
              <mesh position={[0, 0.4, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.06, 0.8, 16]} />
                <meshStandardMaterial
                  color="#FFB6C1"
                  roughness={0.4}
                  metalness={0.1}
                />
              </mesh>
              {/* Wax drip */}
              <mesh position={[0.03, 0.75, 0]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshStandardMaterial color="#FFFAF0" roughness={0.5} />
              </mesh>
              {/* Wick */}
              <mesh position={[0, 0.85, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.1, 8]} />
                <meshStandardMaterial color="#2C2420" roughness={0.8} />
              </mesh>
              {/* Flame */}
              <mesh position={[0, 0.95, 0]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshBasicMaterial color="#FFD700" />
              </mesh>
              {/* Flame glow */}
              <mesh position={[0, 0.95, 0]} scale={[1.3, 1.5, 1.3]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshBasicMaterial
                  color="#FFA500"
                  transparent
                  opacity={0.4}
                />
              </mesh>
              {/* Point light for flame */}
              <pointLight
                position={[0, 0.95, 0]}
                intensity={1.2}
                color="#FFD700"
                distance={2.5}
                decay={2}
              />
            </group>
          );
        }

        return null;
      })}
    </group>
  );
}

EnhancedToppings.propTypes = {
  type: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  scale: PropTypes.number.isRequired,
  yOffset: PropTypes.number.isRequired,
};

/**
 * Enhanced Cake Plate
 */
function EnhancedPlate({ scale }) {
  return (
    <group position={[0, -0.05, 0]}>
      {/* Main plate */}
      <mesh receiveShadow>
        <cylinderGeometry args={[2.5 * scale, 2.3 * scale, 0.12, 64]} />
        <meshPhysicalMaterial
          color="#FFFFFF"
          roughness={0.08}
          metalness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.1}
          reflectivity={0.8}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Decorative rim */}
      <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5 * scale * 0.98, 0.015, 16, 100]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Inner decorative circle */}
      <mesh position={[0, 0.065, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2 * scale, 0.01, 16, 100]} />
        <meshStandardMaterial color="#FFD700" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Plate shadow/base */}
      <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.5 * scale, 64]} />
        <meshStandardMaterial color="#F5F5F5" roughness={0.9} />
      </mesh>
    </group>
  );
}

EnhancedPlate.propTypes = {
  scale: PropTypes.number.isRequired,
};

/**
 * Complete Enhanced Cake Model
 */
export function ImprovedCakeModel({ config, onSpotClick }) {
  const groupRef = useRef(null);

  // Gentle floating animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = -0.3 + Math.sin(state.clock.elapsedTime * 0.6) * 0.04;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.06;
    }
  });

  const scale = SIZE_OPTIONS[config.size]?.scale || 1;
  const flavorData = FLAVOR_OPTIONS[config.flavor];
  const tierCount = TIER_OPTIONS[config.tiers]?.count || 1;
  const frostingColor = COLOR_OPTIONS[config.color];

  // Calculate tier configurations
  const getTierConfig = (tierIndex) => {
    const baseRadius = 2;
    const baseHeight = 1.2;
    const radiusReduction = 0.5;
    const heightReduction = 0.18;

    return {
      radius: baseRadius - tierIndex * radiusReduction,
      height: baseHeight - tierIndex * heightReduction,
    };
  };

  // Calculate tier positions
  const tierPositions = useMemo(() => {
    const positions = [];
    let currentY = 0;

    for (let i = 0; i < tierCount; i++) {
      const tierConfig = getTierConfig(i);
      currentY += tierConfig.height / 2;
      positions.push({
        y: currentY,
        ...tierConfig,
      });
      currentY += tierConfig.height / 2 + 0.12; // Slightly more gap for visual separation
    }

    return positions;
  }, [tierCount]);

  const topTierY =
    tierPositions[tierPositions.length - 1].y +
    tierPositions[tierPositions.length - 1].height / 2;

  return (
    <group ref={groupRef}>
      {/* Enhanced Plate */}
      <EnhancedPlate scale={scale} />

      {/* Render all cake tiers */}
      {tierPositions.map((tier, index) => (
        <EnhancedCakeTier
          key={index}
          yPosition={tier.y}
          radius={tier.radius}
          height={tier.height}
          flavorColor={flavorData?.color || "#F5F5DC"}
          frostingColor={frostingColor}
          scale={scale}
          isTopTier={index === tierPositions.length - 1}
        />
      ))}

      {/* Enhanced Toppings */}
      <EnhancedToppings
        type={config.topper}
        config={config}
        scale={scale * (1 - (tierCount - 1) * 0.15)}
        yOffset={topTierY}
      />

      {/* Ambient sparkles for effect */}
      {config.topper !== "None" && (
        <>
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const radius = scale * 2;
            return (
              <mesh
                key={`sparkle-${i}`}
                position={[
                  Math.cos(angle) * radius,
                  topTierY + 0.3 + Math.sin(angle * 2) * 0.2,
                  Math.sin(angle) * radius,
                ]}
              >
                <sphereGeometry args={[0.02, 8, 8]} />
                <meshBasicMaterial
                  color="#FFD700"
                  transparent
                  opacity={0.6}
                />
              </mesh>
            );
          })}
        </>
      )}
    </group>
  );
}

ImprovedCakeModel.propTypes = {
  config: PropTypes.object.isRequired,
  onSpotClick: PropTypes.func.isRequired,
};
