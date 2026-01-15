import React, {
  useState,
  useRef,
  useCallback,
  Suspense,
  Component,
} from "react";
import PropTypes from "prop-types";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  useCursor,
  Environment,
  ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import { ArrowLeft, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import useCartStore from "../../../stores/cartStore";
import { ConfigOptionCard } from "./ConfigOptionCard";
import { StepIndicator, CompactStepIndicator } from "./StepIndicator";
import { ConfigSummary, PriceBreakdown } from "./PriceBreakdown";
import { PhotorealisticCakeModel } from "./PhotorealisticCakeModel";
import {
  TIER_OPTIONS,
  SIZE_OPTIONS,
  FLAVOR_OPTIONS,
  COLOR_OPTIONS,
  TOPPER_OPTIONS,
  CONFIG_STEPS,
  DEFAULT_CONFIG,
  MESSAGE_SUGGESTIONS,
  calculateTotalPrice,
  formatNPR,
} from "./cakeConfigConstants";

/**
 * Error Boundary for 3D Scene
 */
class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("3D Scene Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cream/50 to-white/50">
          <div className="text-center space-y-4">
            <div className="text-4xl">🎂</div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-dark">
                3D Preview Loading...
              </p>
              <p className="text-sm text-dark/60">
                Your design is being rendered
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

SceneErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * LoadingFallback - Shows loading animation while 3D assets load
 */
function LoadingFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-cream/50 to-white/50">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto" />
        <div className="space-y-2">
          <p className="text-lg font-medium text-dark">Loading 3D Cake...</p>
          <p className="text-sm text-dark/60">
            Preparing your customization experience
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * CameraRig - Smooth camera transitions based on current configuration step
 */
function CameraRig({ currentStep, tierCount }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 3, 9));

  useFrame((state, delta) => {
    const baseY = 3 + (tierCount - 1) * 0.5;
    const baseZ = 9 + (tierCount - 1) * 2;

    // Adjust camera based on step
    switch (currentStep) {
      case "topper":
        targetPos.current.set(0, baseY + 2, baseZ - 3);
        break;
      case "size":
      case "tiers":
        targetPos.current.set(0, baseY, baseZ + 2);
        break;
      default:
        targetPos.current.set(0, baseY, baseZ);
    }

    camera.position.lerp(targetPos.current, 2 * delta);
    camera.lookAt(0, (tierCount - 1) * 0.8, 0);
  });

  return null;
}

CameraRig.propTypes = {
  currentStep: PropTypes.string.isRequired,
  tierCount: PropTypes.number.isRequired,
};

/**
 * InteractiveSpot - Clickable 3D hotspot with label
 */
function InteractiveSpot({ position, label, onClick, active }) {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  return (
    <group position={position}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial
          color={active || hovered ? "#EA580C" : "#ffffff"}
          transparent
          opacity={0.9}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.25, 32]} />
        <meshBasicMaterial
          color={active || hovered ? "#EA580C" : "#ffffff"}
          transparent
          opacity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {(hovered || active) && (
        <Html
          position={[0.3, 0.3, 0]}
          center
          distanceFactor={8}
          zIndexRange={[100, 0]}
        >
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg border border-dark/10">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  active ? "bg-accent animate-pulse" : "bg-dark/30"
                }`}
              />
              <span className="text-xs font-medium text-dark">{label}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

InteractiveSpot.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  active: PropTypes.bool,
};

/**
 * ProceduralToppings - Renders 3D decorations based on topper type
 */
function ProceduralToppings({ type, config, scale, yOffset }) {
  const topperData = TOPPER_OPTIONS[type] || { items: [] };
  const items = topperData.items;

  return (
    <group position={[0, yOffset + 0.05, 0]}>
      {items.map((item, i) => {
        // Render different topping types
        if (item.type === "fruit") {
          return (
            <mesh key={i} position={item.pos} castShadow>
              <sphereGeometry args={[item.scale * scale, 16, 16]} />
              <meshPhysicalMaterial
                color="#C21E56"
                roughness={0.2}
                clearcoat={0.5}
                clearcoatRoughness={0.1}
              />
            </mesh>
          );
        }
        if (item.type === "chocolate") {
          return (
            <mesh
              key={i}
              position={item.pos}
              rotation={[Math.random(), Math.random(), Math.random()]}
              castShadow
            >
              <boxGeometry
                args={[
                  item.scale * scale,
                  item.scale * scale * 0.3,
                  item.scale * scale * 0.5,
                ]}
              />
              <meshPhysicalMaterial
                color="#3E2723"
                roughness={0.3}
                metalness={0.1}
              />
            </mesh>
          );
        }
        if (item.type === "flower") {
          return (
            <group key={i} position={item.pos} scale={[scale, scale, scale]}>
              {[0, 1, 2, 3, 4].map((petal) => (
                <mesh
                  key={petal}
                  position={[0, 0.05, 0]}
                  rotation={[0, (petal / 5) * Math.PI * 2, 0]}
                >
                  <sphereGeometry args={[0.15, 8, 8]} />
                  <meshStandardMaterial color="#FFB7C5" />
                </mesh>
              ))}
              <mesh position={[0, 0.1, 0]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshStandardMaterial color="#FFD700" />
              </mesh>
            </group>
          );
        }
        if (item.type === "macaron") {
          return (
            <group key={i} position={item.pos} scale={[scale, scale, scale]}>
              <mesh position={[0, 0.05, 0]} castShadow>
                <cylinderGeometry args={[item.scale, item.scale, 0.15, 32]} />
                <meshStandardMaterial color={COLOR_OPTIONS[config.color]} />
              </mesh>
              <mesh position={[0, 0.15, 0]}>
                <cylinderGeometry
                  args={[item.scale * 0.9, item.scale * 0.9, 0.05, 32]}
                />
                <meshStandardMaterial color="#fff" />
              </mesh>
              <mesh position={[0, 0.25, 0]} castShadow>
                <cylinderGeometry args={[item.scale, item.scale, 0.15, 32]} />
                <meshStandardMaterial color={COLOR_OPTIONS[config.color]} />
              </mesh>
            </group>
          );
        }
        if (item.type === "candle") {
          return (
            <group key={i} position={item.pos} scale={[scale, scale, scale]}>
              <mesh position={[0, 0.6, 0]} castShadow>
                <cylinderGeometry args={[0.1, 0.1, 1.2, 16]} />
                <meshStandardMaterial color="#fff" />
              </mesh>
              <mesh position={[0, 1.3, 0]}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshBasicMaterial color="#FFD700" />
              </mesh>
              <pointLight
                position={[0, 1.4, 0]}
                intensity={0.8}
                color="#FFA500"
                distance={3}
              />
            </group>
          );
        }
        return null;
      })}
    </group>
  );
}

ProceduralToppings.propTypes = {
  type: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
  scale: PropTypes.number.isRequired,
  yOffset: PropTypes.number.isRequired,
};

/**
 * CakeTier - Individual cake layer with frosting
 */
function CakeTier({
  yPosition,
  radius,
  height,
  flavorColor,
  frostingColor,
  scale,
}) {
  return (
    <group position={[0, yPosition, 0]}>
      {/* Cake Base (Sponge) */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry
          args={[radius * 0.99 * scale, radius * 0.99 * scale, height, 64]}
        />
        <meshPhysicalMaterial
          color={flavorColor}
          roughness={0.5}
          metalness={0.0}
          reflectivity={0.1}
        />
      </mesh>

      {/* Frosting Layer */}
      <mesh receiveShadow>
        <cylinderGeometry args={[radius * scale, radius * scale, height, 64]} />
        <meshPhysicalMaterial
          color={frostingColor}
          roughness={0.4}
          metalness={0.1}
          clearcoat={0.3}
          clearcoatRoughness={0.2}
        />
      </mesh>

      {/* Top Edge */}
      <mesh position={[0, height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * scale * 0.98, 0.05, 16, 64]} />
        <meshPhysicalMaterial
          color={frostingColor}
          roughness={0.4}
          clearcoat={0.3}
        />
      </mesh>

      {/* Bottom Edge */}
      <mesh position={[0, -height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius * scale * 0.98, 0.05, 16, 64]} />
        <meshPhysicalMaterial
          color={frostingColor}
          roughness={0.4}
          clearcoat={0.3}
        />
      </mesh>

      {/* Top Surface */}
      <mesh position={[0, height / 2 + 0.01, 0]} receiveShadow>
        <cylinderGeometry
          args={[radius * scale * 0.98, radius * scale * 0.98, 0.02, 64]}
        />
        <meshPhysicalMaterial
          color={frostingColor}
          roughness={0.3}
          clearcoat={0.5}
        />
      </mesh>
    </group>
  );
}

CakeTier.propTypes = {
  yPosition: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  flavorColor: PropTypes.string.isRequired,
  frostingColor: PropTypes.string.isRequired,
  scale: PropTypes.number.isRequired,
};

/**
 * CakeModel - Complete 3D cake with all tiers and decorations
 */
function CakeModel({ config, onSpotClick }) {
  const groupRef = useRef(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        -0.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
      groupRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
    }
  });

  const scale = SIZE_OPTIONS[config.size]?.scale || 1;
  const flavorData = FLAVOR_OPTIONS[config.flavor] || { color: "#F5F5DC" };
  const tierCount = TIER_OPTIONS[config.tiers]?.count || 1;
  const frostingColor = COLOR_OPTIONS[config.color] || "#FFFFFF";

  // Calculate tier dimensions
  const getTierConfig = (tierIndex) => {
    const baseRadius = 2;
    const baseHeight = 1.2;
    const radiusReduction = 0.4;
    const heightReduction = 0.15;

    return {
      radius: baseRadius - tierIndex * radiusReduction,
      height: baseHeight - tierIndex * heightReduction,
    };
  };

  // Calculate Y positions for tiers
  const calculateTierPositions = () => {
    const positions = [];
    let currentY = 0;

    for (let i = 0; i < tierCount; i++) {
      const tierConfig = getTierConfig(i);
      currentY += tierConfig.height / 2;
      positions.push({
        y: currentY,
        ...tierConfig,
      });
      currentY += tierConfig.height / 2 + 0.1;
    }

    return positions;
  };

  const tierPositions = calculateTierPositions();
  const topTierY =
    tierPositions[tierPositions.length - 1].y +
    tierPositions[tierPositions.length - 1].height / 2;

  return (
    <group ref={groupRef}>
      {/* Render all tiers */}
      {tierPositions.map((tier, index) => (
        <CakeTier
          key={`tier-${index}-${config.color}-${config.flavor}`}
          yPosition={tier.y}
          radius={tier.radius}
          height={tier.height}
          flavorColor={flavorData.color}
          frostingColor={frostingColor}
          scale={scale}
        />
      ))}

      {/* Toppings */}
      <ProceduralToppings
        type={config.topper}
        config={config}
        scale={scale * (1 - (tierCount - 1) * 0.2)}
        yOffset={topTierY}
      />

      {/* Interactive Spots */}
      <InteractiveSpot
        position={[0, topTierY + 1, 0]}
        label="Topper"
        active={false}
        onClick={() => onSpotClick("topper")}
      />
      <InteractiveSpot
        position={[
          tierPositions[0].radius * scale + 0.3,
          tierPositions[0].y,
          0.5,
        ]}
        label="Color"
        active={false}
        onClick={() => onSpotClick("color")}
      />
      <InteractiveSpot
        position={[
          0,
          tierPositions[Math.floor(tierCount / 2)].y,
          tierPositions[Math.floor(tierCount / 2)].radius * scale + 0.3,
        ]}
        label="Flavor"
        active={false}
        onClick={() => onSpotClick("flavor")}
      />

      {/* Plate */}
      <mesh position={[0, -0.1, 0]} receiveShadow>
        <cylinderGeometry args={[2.5 * scale, 2.2 * scale, 0.15, 64]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.1}
          metalness={0.2}
          clearcoat={1}
          transmission={0.1}
        />
      </mesh>
      <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.5 * scale, 0.02, 16, 100]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
      </mesh>
    </group>
  );
}

CakeModel.propTypes = {
  config: PropTypes.object.isRequired,
  onSpotClick: PropTypes.func.isRequired,
};

/**
 * Scene - Professional Food Photography Lighting Setup
 * 7-light setup mimicking studio food photography for appetizing appearance
 */
function Scene({ config, currentStep, setCurrentStep }) {
  const [useSimpleModel, setUseSimpleModel] = React.useState(false);
  const tierCount = TIER_OPTIONS[config.tiers]?.count || 1;

  // Handle WebGL errors by falling back to simple model
  React.useEffect(() => {
    const handleContextLost = (e) => {
      console.warn("WebGL context lost, switching to simple model");
      e.preventDefault();
      setUseSimpleModel(true);
    };

    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("webglcontextlost", handleContextLost);
      return () =>
        canvas.removeEventListener("webglcontextlost", handleContextLost);
    }
  }, []);

  return (
    <>
      <CameraRig currentStep={currentStep} tierCount={tierCount} />

      {/* ========== FOOD PHOTOGRAPHY 7-LIGHT SETUP ========== */}

      {/* 1. WARM AMBIENT - Base illumination */}
      <ambientLight intensity={0.4} color="#FFF8F0" />

      {/* 2. KEY LIGHT - Main light (warm, golden hour feel) 45° angle */}
      <spotLight
        position={[7, 12, 6]}
        angle={0.3}
        penumbra={0.7}
        intensity={2.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        color="#FFFAF0"
      />

      {/* 3. FILL LIGHT - Soft, warm fill (reduces harsh shadows) */}
      <spotLight
        position={[-5, 8, -4]}
        angle={0.5}
        penumbra={0.9}
        intensity={1.4}
        color="#FFE4E1"
      />

      {/* 4. RIM/BACK LIGHT - Creates depth and separation */}
      <spotLight
        position={[-2, 6, -8]}
        angle={0.35}
        penumbra={0.6}
        intensity={1.2}
        color="#FFF5E1"
      />

      {/* 5. TOP LIGHT - Highlights toppings and creates shine */}
      <directionalLight
        position={[0, 10, 2]}
        intensity={0.8}
        color="#FFFACD"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* 6. ACCENT LIGHTS - Small highlights for realism */}
      <pointLight
        position={[4, 4, 4]}
        intensity={0.6}
        distance={8}
        decay={2}
        color="#FFE5B4"
      />
      <pointLight
        position={[-4, 3, 3]}
        intensity={0.4}
        distance={7}
        decay={2}
        color="#FFF8DC"
      />

      {/* 7. HEMISPHERE LIGHT - Natural ambient feel */}
      <hemisphereLight
        skyColor="#FFFAF0"
        groundColor="#FFF5EE"
        intensity={0.5}
      />

      {/* ENVIRONMENT MAP - Soft reflections */}
      <Environment preset="apartment" environmentIntensity={0.6} />

      {/* ========== CAKE MODEL ========== */}
      {useSimpleModel ? (
        <CakeModel config={config} onSpotClick={setCurrentStep} />
      ) : (
        <PhotorealisticCakeModel config={config} />
      )}

      {/* ULTRA-SOFT CONTACT SHADOWS */}
      <ContactShadows
        position={[0, -0.25, 0]}
        opacity={0.3}
        scale={15}
        blur={2.5}
        far={5}
        resolution={512}
        color="#8B7355"
      />
    </>
  );
}

Scene.propTypes = {
  config: PropTypes.object.isRequired,
  currentStep: PropTypes.string.isRequired,
  setCurrentStep: PropTypes.func.isRequired,
};

/**
 * CakeConfigurator - Main component
 * Production-ready 3D cake customizer with cart integration
 */
export const CakeConfigurator = ({
  onClose,
  initialConfig = DEFAULT_CONFIG,
}) => {
  const [currentStep, setCurrentStep] = useState("tiers");
  const [config, setConfig] = useState(initialConfig);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const canvasRef = useRef(null);

  const addToCart = useCartStore((state) => state.addToCart);
  const items = useCartStore((state) => state.items);

  // Calculate prices
  const basePrice = SIZE_OPTIONS[config.size]?.price || 0;
  const topperPrice = TOPPER_OPTIONS[config.topper]?.price || 0;
  const tierMultiplier = TIER_OPTIONS[config.tiers]?.priceMultiplier || 1;
  const totalPrice = calculateTotalPrice(
    config.size,
    config.topper,
    config.tiers
  );
  const servings = SIZE_OPTIONS[config.size]?.serves || "";

  // Update configuration
  const updateConfig = useCallback((key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Navigate steps
  const currentStepIndex = CONFIG_STEPS.findIndex((s) => s.id === currentStep);
  const canGoNext = currentStepIndex < CONFIG_STEPS.length - 1;
  const canGoPrev = currentStepIndex > 0;

  const handleNext = () => {
    if (canGoNext) {
      setCurrentStep(CONFIG_STEPS[currentStepIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentStep(CONFIG_STEPS[currentStepIndex - 1].id);
    }
  };

  // Capture screenshot from canvas
  const captureScreenshot = useCallback(() => {
    try {
      if (!canvasRef.current) {
        console.warn("Canvas not found");
        return null;
      }

      // Get the canvas element
      const canvas = canvasRef.current.querySelector("canvas");
      if (!canvas) {
        console.warn("Canvas element not found");
        return null;
      }

      // Convert canvas to base64 image
      const imageData = canvas.toDataURL("image/jpeg", 0.8);
      return imageData;
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      return null;
    }
  }, []);

  // Add to cart
  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);

      // Capture screenshot of the 3D cake
      const screenshot = captureScreenshot();

      const customId = `custom-${Date.now()}`;

      // Create cart item matching the existing cart structure
      const cartItem = {
        cakeId: customId,
        cake: {
          _id: customId,
          name: `Custom ${config.flavor} Cake`,
          slug: `custom-${config.flavor
            .toLowerCase()
            .replace(/\s+/g, "-")}-cake`,
          description: `${config.tiers} • ${config.size} • ${config.flavor} • ${config.color}`,
          basePrice: totalPrice,
          images: [
            {
              url: screenshot || FLAVOR_OPTIONS[config.flavor]?.image || "",
              alt: config.flavor,
              isScreenshot: !!screenshot,
            },
          ],
          category: {
            name: "Custom Cakes",
            slug: "custom-cakes",
          },
          isCustomizable: true,
          weightOptions: [
            {
              weight: SIZE_OPTIONS[config.size].weight,
              unit: "kg",
              price: totalPrice,
              weightInKg: SIZE_OPTIONS[config.size].weight,
              _id: config.size,
            },
          ],
        },
        quantity: 1,
        selectedWeight: {
          weight: SIZE_OPTIONS[config.size].weight,
          unit: "kg",
          price: totalPrice,
          weightInKg: SIZE_OPTIONS[config.size].weight,
          _id: config.size,
        },
        customization: {
          tiers: config.tiers,
          size: config.size,
          flavor: config.flavor,
          color: config.color,
          frostingColorHex: COLOR_OPTIONS[config.color],
          topper: config.topper,
          topperPrice: TOPPER_OPTIONS[config.topper]?.price || 0,
          message: config.message,
          previewImage: screenshot, // 3D preview image
        },
      };

      // Add to cart (guest mode - false for now)
      const result = await addToCart(cartItem, false);

      if (result.success) {
        toast.success("Custom cake added to cart!", {
          position: "top-right",
          autoClose: 3000,
        });

        // Close after short delay
        setTimeout(() => {
          if (onClose) onClose();
        }, 500);
      } else {
        throw new Error(result.message || "Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(error.message || "Failed to add to cart. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-cream flex flex-col overflow-hidden">
      {/* HEADER */}
      <header className="h-16 lg:h-20 px-4 lg:px-8 flex items-center justify-between bg-white border-b border-dark/10 flex-shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-dark/60 hover:text-dark transition-colors group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-sm font-medium hidden sm:inline">Back</span>
        </button>

        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-lg lg:text-xl font-medium text-dark">
            Design Your Cake
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-lg font-medium text-accent">
              {formatNPR(totalPrice)}
            </div>
            <div className="text-xs text-dark/50">Serves {servings}</div>
          </div>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="bg-accent text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-lg text-sm font-medium hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 p-4 lg:p-6 overflow-hidden">
        {/* LEFT SIDEBAR - Step Indicator (Desktop) */}
        <div className="hidden lg:flex lg:col-span-2 flex-col justify-center">
          <StepIndicator
            steps={CONFIG_STEPS}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />
        </div>

        {/* Mobile Progress */}
        <div className="lg:hidden col-span-1">
          <CompactStepIndicator
            steps={CONFIG_STEPS}
            currentStep={currentStep}
          />
        </div>

        {/* CENTER - 3D Preview */}
        <div
          ref={canvasRef}
          className="col-span-1 lg:col-span-6 rounded-2xl overflow-hidden shadow-lg relative min-h-[400px] lg:min-h-[500px]"
          style={{
            background:
              "linear-gradient(135deg, #FFF8F0 0%, #FFF5E6 50%, #FFEDD5 100%)",
          }}
        >
          <SceneErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Canvas
                shadows="soft"
                dpr={[1, 2]}
                gl={{
                  antialias: true,
                  alpha: false,
                  powerPreference: "high-performance",
                  preserveDrawingBuffer: true,
                  toneMapping: THREE.ACESFilmicToneMapping,
                  toneMappingExposure: 1.35,
                  outputColorSpace: THREE.SRGBColorSpace,
                }}
                camera={{
                  fov: 42,
                  near: 0.1,
                  far: 100,
                  position: [0, 3, 9],
                }}
                className="w-full h-full"
                onCreated={({ gl }) => {
                  gl.setClearColor("#FFF8F0", 1);
                  gl.physicallyCorrectLights = true;
                }}
              >
                <Scene
                  config={config}
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                />
                <OrbitControls
                  enablePan={false}
                  enableDamping
                  dampingFactor={0.05}
                  rotateSpeed={0.5}
                  minPolarAngle={Math.PI / 6}
                  maxPolarAngle={Math.PI / 2.2}
                  minDistance={6}
                  maxDistance={15}
                />
              </Canvas>
            </Suspense>
          </SceneErrorBoundary>

          {/* 3D Controls Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg text-xs text-dark/70 pointer-events-none shadow-md border border-dark/10">
            <span className="font-medium">Drag to rotate</span> •{" "}
            <span className="font-medium">Scroll to zoom</span>
          </div>

          {/* Current Step Label */}
          <div className="absolute top-4 left-4 bg-accent/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium text-white shadow-md">
            {CONFIG_STEPS.find((s) => s.id === currentStep)?.label || "Preview"}
          </div>
        </div>

        {/* RIGHT SIDEBAR - Options & Summary */}
        <div className="col-span-1 lg:col-span-4 flex flex-col gap-4 overflow-y-auto">
          {/* Configuration Options */}
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg">
            <h3 className="text-sm font-medium text-dark/50 uppercase tracking-wide mb-4 transition-all duration-300">
              {CONFIG_STEPS.find((s) => s.id === currentStep)?.label}
            </h3>

            {/* Render options based on current step with animation key */}
            <div key={currentStep} className="space-y-3 mb-6">
              {/* TIERS */}
              {currentStep === "tiers" && (
                <div className="space-y-3">
                  {Object.keys(TIER_OPTIONS).map((tier, index) => (
                    <div
                      key={tier}
                      style={{ animationDelay: `${index * 50}ms` }}
                      className="animate-fadeInSlideUp"
                    >
                      <ConfigOptionCard
                        label={tier}
                        description={`×${TIER_OPTIONS[tier].priceMultiplier} price`}
                        isSelected={config.tiers === tier}
                        onClick={() => updateConfig("tiers", tier)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* SIZE */}
              {currentStep === "size" && (
                <div className="space-y-3">
                  {Object.keys(SIZE_OPTIONS).map((size, index) => (
                    <div
                      key={size}
                      style={{ animationDelay: `${index * 50}ms` }}
                      className="animate-fadeInSlideUp"
                    >
                      <ConfigOptionCard
                        label={SIZE_OPTIONS[size].label}
                        description={`Serves ${SIZE_OPTIONS[size].serves}`}
                        price={SIZE_OPTIONS[size].price}
                        isSelected={config.size === size}
                        onClick={() => updateConfig("size", size)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* FLAVOR */}
              {currentStep === "flavor" && (
                <div className="grid grid-cols-2 gap-3">
                  {Object.keys(FLAVOR_OPTIONS).map((flavor, index) => (
                    <div
                      key={flavor}
                      style={{ animationDelay: `${index * 50}ms` }}
                      className="animate-scaleIn"
                    >
                      <ConfigOptionCard
                        label={flavor}
                        description={FLAVOR_OPTIONS[flavor].nameNepali}
                        image={FLAVOR_OPTIONS[flavor].image}
                        colorValue={FLAVOR_OPTIONS[flavor].color}
                        isSelected={config.flavor === flavor}
                        onClick={() => updateConfig("flavor", flavor)}
                        variant="flavor"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* COLOR */}
              {currentStep === "color" && (
                <div className="grid grid-cols-4 gap-3">
                  {Object.keys(COLOR_OPTIONS).map((color, index) => (
                    <div
                      key={color}
                      style={{ animationDelay: `${index * 30}ms` }}
                      className="animate-scaleIn"
                    >
                      <ConfigOptionCard
                        label={color}
                        colorValue={COLOR_OPTIONS[color]}
                        isSelected={config.color === color}
                        onClick={() => updateConfig("color", color)}
                        variant="color"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* TOPPER */}
              {currentStep === "topper" && (
                <div className="space-y-3">
                  {Object.keys(TOPPER_OPTIONS).map((topper, index) => (
                    <div
                      key={topper}
                      style={{ animationDelay: `${index * 50}ms` }}
                      className="animate-fadeInSlideUp"
                    >
                      <ConfigOptionCard
                        label={TOPPER_OPTIONS[topper].label || topper}
                        description={TOPPER_OPTIONS[topper].description}
                        price={TOPPER_OPTIONS[topper].price}
                        isSelected={config.topper === topper}
                        onClick={() => updateConfig("topper", topper)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* MESSAGE */}
              {currentStep === "message" && (
                <div className="space-y-4 animate-fadeInSlideUp">
                  <div
                    style={{ animationDelay: "0ms" }}
                    className="animate-fadeInSlideUp"
                  >
                    <label className="text-sm font-medium text-dark block mb-2">
                      Cake Message (Optional)
                    </label>
                    <input
                      type="text"
                      value={config.message}
                      onChange={(e) => updateConfig("message", e.target.value)}
                      placeholder="e.g., Happy Birthday!"
                      maxLength={30}
                      className="w-full px-4 py-3 border border-dark/20 rounded-lg text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
                    />
                    <p className="text-xs text-dark/50 mt-1">
                      {30 - config.message.length} characters remaining
                    </p>
                  </div>
                  <div
                    style={{ animationDelay: "100ms" }}
                    className="animate-fadeInSlideUp"
                  >
                    <p className="text-xs text-dark/50 mb-2">
                      Quick suggestions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {MESSAGE_SUGGESTIONS.map((msg, index) => (
                        <button
                          key={msg}
                          style={{ animationDelay: `${150 + index * 50}ms` }}
                          onClick={() => updateConfig("message", msg)}
                          className="px-3 py-1 text-xs bg-cream border border-dark/20 rounded-lg hover:border-accent hover:text-accent transition-colors animate-fadeIn"
                        >
                          {msg}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                disabled={!canGoPrev}
                className="flex-1 py-2.5 px-4 border border-dark/20 rounded-lg text-sm font-medium text-dark hover:border-dark/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className="flex-1 py-2.5 px-4 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Next
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Summary & Pricing */}
          <ConfigSummary
            config={config}
            totalPrice={totalPrice}
            servings={servings}
          />

          {/* Price Breakdown */}
          <PriceBreakdown
            config={config}
            basePrice={basePrice}
            topperPrice={topperPrice}
            tierMultiplier={tierMultiplier}
            totalPrice={totalPrice}
          />
        </div>
      </main>

      {/* Mobile FAB - Add to Cart */}
      <div className="lg:hidden fixed bottom-6 right-6 z-10">
        <button
          onClick={handleAddToCart}
          disabled={isAddingToCart}
          className="bg-accent text-white w-14 h-14 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <ShoppingBag size={24} />
        </button>
        <div className="absolute -top-2 -right-2 bg-dark text-white text-xs font-medium px-2 py-1 rounded-full">
          {formatNPR(totalPrice).replace("रू ", "रू")}
        </div>
      </div>
    </div>
  );
};

CakeConfigurator.propTypes = {
  onClose: PropTypes.func,
  initialConfig: PropTypes.object,
};

CakeConfigurator.defaultProps = {
  onClose: () => {},
  initialConfig: DEFAULT_CONFIG,
};

export default CakeConfigurator;
