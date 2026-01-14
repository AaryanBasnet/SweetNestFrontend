import React, { useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Sparkles } from "@react-three/drei";

/**
 * VISUAL EFFECTS COMPONENTS
 * Drips, Ribbons, Metallic effects, etc.
 */

// ==================== DRIP EFFECT ====================

/**
 * Realistic Drip Effect - Chocolate or Caramel cascading down cake sides
 */
export function DripEffect({
  radius,
  yPosition,
  scale,
  type = "chocolate", // "chocolate", "caramel", "white-chocolate"
  intensity = "medium" // "light", "medium", "heavy"
}) {
  const dripCounts = {
    light: 8,
    medium: 16,
    heavy: 24,
  };

  const dripColors = {
    chocolate: "#3E2723",
    caramel: "#C68642",
    "white-chocolate": "#FFF8DC",
    strawberry: "#C21E56",
    "matcha": "#77DD77",
  };

  const dripCount = dripCounts[intensity] || 16;
  const dripColor = dripColors[type] || dripColors.chocolate;

  const drips = useMemo(() => {
    const dripsArray = [];
    for (let i = 0; i < dripCount; i++) {
      const angle = (i / dripCount) * Math.PI * 2 + Math.random() * 0.3;
      const dripLength = 0.3 + Math.random() * 0.4;
      const dripWidth = 0.08 + Math.random() * 0.05;

      dripsArray.push({
        angle,
        length: dripLength,
        width: dripWidth,
        offset: Math.random() * 0.05,
      });
    }
    return dripsArray;
  }, [dripCount]);

  return (
    <group position={[0, yPosition, 0]}>
      {/* Pool of drip on top edge */}
      <mesh position={[0, 0.01, 0]}>
        <torusGeometry args={[radius * scale * 0.98, 0.04, 16, 64]} />
        <meshPhysicalMaterial
          color={dripColor}
          roughness={0.15}
          metalness={0.05}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
          transmission={0.1}
          thickness={0.8}
        />
      </mesh>

      {/* Individual drips */}
      {drips.map((drip, i) => {
        const x = Math.cos(drip.angle) * radius * scale * 0.98;
        const z = Math.sin(drip.angle) * radius * scale * 0.98;

        return (
          <group key={i} position={[x, 0, z]} rotation={[0, drip.angle, 0]}>
            {/* Drip body */}
            <mesh position={[0, -drip.length / 2 - drip.offset, 0]} castShadow>
              <cylinderGeometry
                args={[drip.width * 0.5, drip.width * 0.3, drip.length, 12]}
              />
              <meshPhysicalMaterial
                color={dripColor}
                roughness={0.12}
                metalness={0.05}
                clearcoat={0.9}
                clearcoatRoughness={0.08}
                transmission={0.15}
                thickness={1}
                envMapIntensity={1.2}
              />
            </mesh>

            {/* Drip droplet at bottom */}
            <mesh position={[0, -drip.length - drip.offset - 0.05, 0]} castShadow>
              <sphereGeometry args={[drip.width * 0.4, 12, 12]} />
              <meshPhysicalMaterial
                color={dripColor}
                roughness={0.1}
                clearcoat={0.95}
                transmission={0.2}
                thickness={1.2}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

DripEffect.propTypes = {
  radius: PropTypes.number.isRequired,
  yPosition: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["chocolate", "caramel", "white-chocolate", "strawberry", "matcha"]),
  intensity: PropTypes.oneOf(["light", "medium", "heavy"]),
};

// ==================== RIBBON & BOW ====================

/**
 * Decorative Ribbon wrapping around cake tier
 */
export function RibbonDecoration({
  radius,
  yPosition,
  scale,
  color = "#E74C3C",
  pattern = "solid", // "solid", "satin", "lace"
}) {
  const ribbonWidth = 0.25;
  const ribbonSegments = 64;

  return (
    <group position={[0, yPosition, 0]}>
      {/* Main ribbon band */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry
          args={[
            radius * scale * 1.01,
            radius * scale * 1.01,
            ribbonWidth,
            ribbonSegments
          ]}
        />
        <meshPhysicalMaterial
          color={color}
          roughness={pattern === "satin" ? 0.15 : 0.3}
          metalness={0.05}
          clearcoat={pattern === "satin" ? 0.7 : 0.3}
          clearcoatRoughness={0.2}
          sheen={pattern === "satin" ? 0.8 : 0.3}
          sheenRoughness={0.4}
          sheenColor={new THREE.Color(color).multiplyScalar(1.2)}
        />
      </mesh>

      {/* Ribbon edges */}
      <mesh position={[0, ribbonWidth / 2 + 0.01, 0]}>
        <torusGeometry args={[radius * scale * 1.01, 0.015, 12, ribbonSegments]} />
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.8)} />
      </mesh>

      <mesh position={[0, -ribbonWidth / 2 - 0.01, 0]}>
        <torusGeometry args={[radius * scale * 1.01, 0.015, 12, ribbonSegments]} />
        <meshStandardMaterial color={new THREE.Color(color).multiplyScalar(0.8)} />
      </mesh>

      {/* Bow at front */}
      <Bow
        position={[radius * scale * 1.05, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        scale={scale * 0.8}
        color={color}
        pattern={pattern}
      />
    </group>
  );
}

RibbonDecoration.propTypes = {
  radius: PropTypes.number.isRequired,
  yPosition: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  color: PropTypes.string,
  pattern: PropTypes.oneOf(["solid", "satin", "lace"]),
};

/**
 * 3D Bow for ribbon
 */
function Bow({ position, rotation, scale, color, pattern }) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Left loop */}
      <mesh position={[-0.15, 0.05, 0]} rotation={[0, 0.3, 0]} castShadow>
        <torusGeometry args={[0.12, 0.04, 12, 24, Math.PI]} />
        <meshPhysicalMaterial
          color={color}
          roughness={pattern === "satin" ? 0.15 : 0.3}
          clearcoat={0.7}
          sheen={0.8}
        />
      </mesh>

      {/* Right loop */}
      <mesh position={[0.15, 0.05, 0]} rotation={[0, -0.3, Math.PI]} castShadow>
        <torusGeometry args={[0.12, 0.04, 12, 24, Math.PI]} />
        <meshPhysicalMaterial
          color={color}
          roughness={pattern === "satin" ? 0.15 : 0.3}
          clearcoat={0.7}
          sheen={0.8}
        />
      </mesh>

      {/* Center knot */}
      <mesh position={[0, 0.05, 0]} castShadow>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshPhysicalMaterial
          color={new THREE.Color(color).multiplyScalar(0.9)}
          roughness={0.25}
          clearcoat={0.6}
        />
      </mesh>

      {/* Left ribbon tail */}
      <mesh position={[-0.1, -0.1, 0]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.08, 0.25, 0.02]} />
        <meshPhysicalMaterial
          color={color}
          roughness={pattern === "satin" ? 0.15 : 0.3}
          clearcoat={0.6}
          sheen={0.7}
        />
      </mesh>

      {/* Right ribbon tail */}
      <mesh position={[0.1, -0.1, 0]} rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[0.08, 0.25, 0.02]} />
        <meshPhysicalMaterial
          color={color}
          roughness={pattern === "satin" ? 0.15 : 0.3}
          clearcoat={0.6}
          sheen={0.7}
        />
      </mesh>
    </group>
  );
}

Bow.propTypes = {
  position: PropTypes.array.isRequired,
  rotation: PropTypes.array.isRequired,
  scale: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  pattern: PropTypes.string.isRequired,
};

// ==================== METALLIC EFFECTS ====================

/**
 * Metallic/Shimmer Effect Overlay
 */
export function MetallicEffect({
  radius,
  height,
  yPosition,
  scale,
  type = "gold" // "gold", "silver", "rose-gold", "glitter"
}) {
  const metallicColors = {
    gold: "#FFD700",
    silver: "#C0C0C0",
    "rose-gold": "#B76E79",
    copper: "#B87333",
  };

  const baseColor = metallicColors[type] || metallicColors.gold;

  if (type === "glitter") {
    return (
      <group position={[0, yPosition, 0]}>
        {/* Glitter particles */}
        <Sparkles
          count={100}
          scale={[radius * scale * 2, height, radius * scale * 2]}
          size={2}
          speed={0.1}
          opacity={0.6}
          color="#FFD700"
        />
      </group>
    );
  }

  return (
    <group position={[0, yPosition, 0]}>
      {/* Metallic overlay layer */}
      <mesh>
        <cylinderGeometry args={[radius * scale * 1.001, radius * scale * 1.001, height, 64]} />
        <meshPhysicalMaterial
          color={baseColor}
          roughness={0.08}
          metalness={0.95}
          clearcoat={0.9}
          clearcoatRoughness={0.05}
          reflectivity={0.95}
          envMapIntensity={2}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Shimmer highlights */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x = Math.cos(angle) * radius * scale * 0.99;
        const z = Math.sin(angle) * radius * scale * 0.99;
        return (
          <pointLight
            key={i}
            position={[x, Math.sin(angle * 3) * height * 0.3, z]}
            intensity={0.2}
            distance={0.5}
            color={baseColor}
          />
        );
      })}
    </group>
  );
}

MetallicEffect.propTypes = {
  radius: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  yPosition: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["gold", "silver", "rose-gold", "copper", "glitter"]),
};

// ==================== OMBRE GRADIENT ====================

/**
 * Ombre Gradient Effect - Color fade between tiers
 */
export function OmbreGradient({
  radius,
  height,
  yPosition,
  scale,
  topColor,
  bottomColor,
}) {
  const gradientSteps = 10;

  return (
    <group position={[0, yPosition, 0]}>
      {Array.from({ length: gradientSteps }).map((_, i) => {
        const t = i / (gradientSteps - 1);
        const colorTop = new THREE.Color(topColor);
        const colorBottom = new THREE.Color(bottomColor);
        const blendedColor = colorTop.clone().lerp(colorBottom, t);

        const stepHeight = height / gradientSteps;
        const stepY = -height / 2 + (i * stepHeight) + stepHeight / 2;

        return (
          <mesh key={i} position={[0, stepY, 0]}>
            <cylinderGeometry
              args={[
                radius * scale * 1.002,
                radius * scale * 1.002,
                stepHeight + 0.01,
                64
              ]}
            />
            <meshPhysicalMaterial
              color={blendedColor}
              roughness={0.25}
              metalness={0.02}
              clearcoat={0.4}
              transmission={0.03}
              transparent
              opacity={0.9}
            />
          </mesh>
        );
      })}
    </group>
  );
}

OmbreGradient.propTypes = {
  radius: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  yPosition: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  topColor: PropTypes.string.isRequired,
  bottomColor: PropTypes.string.isRequired,
};

// ==================== CONFETTI CELEBRATION ====================

/**
 * Confetti Animation - Celebration effect when adding to cart
 */
export function ConfettiCelebration({ active, position = [0, 3, 0] }) {
  const confettiRef = useRef();
  const particlesRef = useRef([]);

  // Initialize particles
  useMemo(() => {
    if (active) {
      particlesRef.current = Array.from({ length: 100 }).map(() => ({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          0,
          (Math.random() - 0.5) * 2
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 4,
          Math.random() * 6 + 4,
          (Math.random() - 0.5) * 4
        ),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        color: [
          '#FFD700', '#FF69B4', '#87CEEB', '#90EE90', '#FFA500',
          '#DDA0DD', '#F0E68C', '#FF6347'
        ][Math.floor(Math.random() * 8)],
      }));
    }
  }, [active]);

  useFrame((state, delta) => {
    if (!active || !confettiRef.current) return;

    particlesRef.current.forEach((particle) => {
      particle.velocity.y -= 9.8 * delta; // Gravity
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));
      particle.rotation += particle.rotationSpeed;
    });
  });

  if (!active) return null;

  return (
    <group ref={confettiRef} position={position}>
      {particlesRef.current.map((particle, i) => (
        <mesh
          key={i}
          position={particle.position.toArray()}
          rotation={[particle.rotation, particle.rotation, 0]}
        >
          <boxGeometry args={[0.1, 0.15, 0.02]} />
          <meshStandardMaterial color={particle.color} />
        </mesh>
      ))}
    </group>
  );
}

ConfettiCelebration.propTypes = {
  active: PropTypes.bool.isRequired,
  position: PropTypes.array,
};
