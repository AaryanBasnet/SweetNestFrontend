import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Eye, Camera, Video, Maximize2 } from "lucide-react";

/**
 * CAMERA PRESETS & CONTROLS
 * Front, Side, Top, Angled views with smooth transitions
 */

export const CAMERA_PRESETS = {
  default: {
    position: [0, 3, 9],
    target: [0, 1.5, 0],
    fov: 42,
    label: "3D View",
    icon: "Eye",
  },
  front: {
    position: [0, 2, 8],
    target: [0, 2, 0],
    fov: 45,
    label: "Front",
    icon: "Camera",
  },
  side: {
    position: [8, 2, 0],
    target: [0, 2, 0],
    fov: 45,
    label: "Side",
    icon: "Camera",
  },
  top: {
    position: [0, 10, 0.1],
    target: [0, 0, 0],
    fov: 50,
    label: "Top",
    icon: "Camera",
  },
  angleHigh: {
    position: [6, 6, 6],
    target: [0, 1, 0],
    fov: 42,
    label: "Hero Shot",
    icon: "Video",
  },
};

/**
 * Smooth Camera Rig with Preset Transitions
 */
export function SmoothCameraRig({ preset, tierCount, enabled = true }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLookAt = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3(0, 1.5, 0));

  useFrame((state, delta) => {
    if (!enabled) return;

    const presetData = CAMERA_PRESETS[preset] || CAMERA_PRESETS.default;

    // Adjust for tier count
    const yOffset = (tierCount - 1) * 0.5;
    const zOffset = (tierCount - 1) * 1.5;

    targetPos.current.set(
      presetData.position[0],
      presetData.position[1] + yOffset,
      presetData.position[2] + zOffset
    );

    targetLookAt.current.set(
      presetData.target[0],
      presetData.target[1] + yOffset * 0.5,
      presetData.target[2]
    );

    // Smooth interpolation
    camera.position.lerp(targetPos.current, delta * 2);
    currentLookAt.current.lerp(targetLookAt.current, delta * 2);
    camera.lookAt(currentLookAt.current);

    // Smooth FOV transition
    camera.fov = THREE.MathUtils.lerp(camera.fov, presetData.fov, delta * 3);
    camera.updateProjectionMatrix();
  });

  return null;
}

SmoothCameraRig.propTypes = {
  preset: PropTypes.string.isRequired,
  tierCount: PropTypes.number.isRequired,
  enabled: PropTypes.bool,
};

/**
 * Camera Preset Selector UI Component
 */
export function CameraPresetSelector({ currentPreset, onChange }) {
  const presets = Object.entries(CAMERA_PRESETS);

  return (
    <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-dark/10 p-2">
      <div className="text-xs font-medium text-dark/50 uppercase tracking-wider px-2 mb-2">
        Camera View
      </div>
      <div className="grid grid-cols-2 gap-2">
        {presets.map(([key, preset]) => {
          const Icon = getIcon(preset.icon);
          const isActive = currentPreset === key;

          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all
                ${
                  isActive
                    ? "bg-accent text-white shadow-md"
                    : "bg-white text-dark/70 hover:bg-accent/10 hover:text-accent border border-dark/10"
                }`}
              title={preset.label}
            >
              <Icon size={14} />
              <span className="hidden sm:inline">{preset.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-2 pt-2 border-t border-dark/10">
        <button
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-white text-dark/70 hover:bg-accent/10 hover:text-accent border border-dark/10 transition-all"
          title="Auto Rotate"
        >
          <Maximize2 size={14} />
          <span>Auto Rotate</span>
        </button>
      </div>
    </div>
  );
}

CameraPresetSelector.propTypes = {
  currentPreset: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

// Helper to get icon component
function getIcon(iconName) {
  const icons = {
    Eye,
    Camera,
    Video,
    Maximize2,
  };
  return icons[iconName] || Eye;
}
