import React from "react";
import PropTypes from "prop-types";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

/**
 * BACKGROUND SCENES
 * Different environments and presentations for the cake
 */

export const BACKGROUND_PRESETS = {
  studio: {
    name: "Clean Studio",
    description: "Minimal white background",
    environment: "warehouse",
    environmentIntensity: 0.8,
    background: "linear-gradient(135deg, #FFF8F0 0%, #FFF5E6 50%, #FFEDD5 100%)",
    fog: { color: "#FFF8F0", near: 15, far: 30 },
  },
  elegant: {
    name: "Elegant Event",
    description: "Warm, sophisticated lighting",
    environment: "city",
    environmentIntensity: 0.7,
    background: "linear-gradient(135deg, #FFF0E6 0%, #FFE4D6 50%, #FFD6C4 100%)",
    fog: { color: "#FFF0E6", near: 12, far: 25 },
  },
  party: {
    name: "Party Celebration",
    description: "Colorful and festive",
    environment: "sunset",
    environmentIntensity: 1,
    background: "linear-gradient(135deg, #FFE5F1 0%, #FFD6E8 50%, #FFC7E0 100%)",
    fog: { color: "#FFE5F1", near: 10, far: 20 },
  },
  outdoor: {
    name: "Outdoor Garden",
    description: "Natural daylight setting",
    environment: "park",
    environmentIntensity: 1.2,
    background: "linear-gradient(135deg, #F0F8FF 0%, #E6F3FF 50%, #D6EBFF 100%)",
    fog: { color: "#F0F8FF", near: 15, far: 30 },
  },
  luxury: {
    name: "Luxury Venue",
    description: "High-end presentation",
    environment: "lobby",
    environmentIntensity: 0.6,
    background: "linear-gradient(135deg, #2C2420 0%, #3E342F 50%, #4A3F3A 100%)",
    fog: { color: "#2C2420", near: 8, far: 20 },
    isDark: true,
  },
};

/**
 * Background Scene Component
 */
export function BackgroundScene({ preset = "studio" }) {
  const sceneData = BACKGROUND_PRESETS[preset] || BACKGROUND_PRESETS.studio;

  return (
    <>
      {/* Environment Map */}
      <Environment
        preset={sceneData.environment}
        environmentIntensity={sceneData.environmentIntensity}
        background={false}
      />

      {/* Fog */}
      {sceneData.fog && (
        <fog
          attach="fog"
          args={[sceneData.fog.color, sceneData.fog.near, sceneData.fog.far]}
        />
      )}

      {/* Additional lighting adjustments for dark backgrounds */}
      {sceneData.isDark && (
        <>
          <ambientLight intensity={0.6} color="#FFFAF0" />
          <pointLight position={[0, 5, 0]} intensity={1} color="#FFD700" />
        </>
      )}
    </>
  );
}

BackgroundScene.propTypes = {
  preset: PropTypes.oneOf(Object.keys(BACKGROUND_PRESETS)),
};

/**
 * Background Selector Component
 */
export function BackgroundSelector({ currentBackground, onChange }) {
  const backgrounds = Object.entries(BACKGROUND_PRESETS);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-dark/70 uppercase tracking-wide">
        Background
      </label>
      <div className="grid grid-cols-2 gap-2">
        {backgrounds.map(([key, bg]) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`p-3 rounded-lg border text-left transition-all ${
              currentBackground === key
                ? "border-accent bg-accent/5 text-accent"
                : "border-dark/20 hover:border-dark/40 text-dark/70"
            }`}
          >
            <div className="font-medium text-sm">{bg.name}</div>
            <div className="text-xs mt-1 opacity-70">{bg.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

BackgroundSelector.propTypes = {
  currentBackground: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

/**
 * Decorative Floor/Table Component
 */
export function DecorativeFloor({ preset = "studio" }) {
  const sceneData = BACKGROUND_PRESETS[preset] || BACKGROUND_PRESETS.studio;

  // Floor appearance based on preset
  const getFloorMaterial = () => {
    switch (preset) {
      case "luxury":
        return (
          <meshPhysicalMaterial
            color="#1a1614"
            roughness={0.1}
            metalness={0.8}
            clearcoat={1}
            reflectivity={0.9}
          />
        );
      case "outdoor":
        return (
          <meshStandardMaterial
            color="#8FBC8F"
            roughness={0.9}
            metalness={0}
          />
        );
      case "party":
        return (
          <meshStandardMaterial
            color="#FFE5F1"
            roughness={0.4}
            metalness={0.1}
          />
        );
      default:
        return (
          <meshStandardMaterial
            color="#F8F8F8"
            roughness={0.7}
            metalness={0}
          />
        );
    }
  };

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.5, 0]}
      receiveShadow
    >
      <circleGeometry args={[15, 64]} />
      {getFloorMaterial()}
    </mesh>
  );
}

DecorativeFloor.propTypes = {
  preset: PropTypes.string,
};
