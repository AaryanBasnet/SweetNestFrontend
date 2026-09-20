import React, { useState, useRef, useCallback, useEffect, Suspense, Component } from "react";
import PropTypes from "prop-types";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import * as LucideIcons from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Loader2,
  RotateCw,
  Pause,
  Download,
  Scissors,
  ChevronDown,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import useCartStore from "../../../stores/cartStore";
import { PhotorealisticCakeModel } from "./PhotorealisticCakeModel";
import { ConfigSummary, PriceBreakdown } from "./PriceBreakdown";
import { BaseStep, FlavorStep, FrostingStep, DecorateStep, PersonalizeStep } from "./ConfigSteps";
import {
  SIZE_OPTIONS,
  FLAVOR_OPTIONS,
  COLOR_OPTIONS,
  TIER_OPTIONS,
  CONFIG_STEPS,
  DEFAULT_CONFIG,
  buildPriceLines,
  formatNPR,
} from "./cakeConfigConstants";

// ============================================
// ERROR BOUNDARY + LOADING
// ============================================

class SceneErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("3D Scene Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="text-center space-y-2">
            <div className="text-4xl">🎂</div>
            <p className="text-sm font-medium text-dark">The 3D preview could not start</p>
            <p className="text-xs text-dark/60">Your selections are still saved. Try reloading the page.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
SceneErrorBoundary.propTypes = { children: PropTypes.node.isRequired };

function LoadingFallback() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-accent" />
      <p className="mt-3 text-sm font-medium text-dark">Preparing your cake…</p>
    </div>
  );
}

// ============================================
// CAMERA
// ============================================

const CAMERA_TARGET = [0, 0.8, 0];

const cameraViewFor = (view, tierCount) => {
  const y = 4.2 + (tierCount - 1) * 0.6;
  const z = 8.6 + (tierCount - 1) * 2;
  switch (view) {
    case "top":
      return [0.01, y + 5.5, z - 4.6];
    case "close":
      return [0, y + 1.2, z - 3];
    case "side":
      return [z * 0.78, y - 1.4, z * 0.5];
    case "slice":
      return [z * 0.6, y - 0.9, z * 0.6];
    default:
      return [0, y, z];
  }
};

const VIEW_FOR_STEP = {
  base: "hero",
  flavor: "slice",
  frosting: "hero",
  decorate: "close",
  personalize: "top",
};

/**
 * Only animates for ~1.6s after a view change so it never fights the
 * user's manual orbiting or the idle turntable.
 */
function CameraRig({ view, nonce, tierCount }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(...cameraViewFor("hero", 1)));
  const remaining = useRef(0);

  useEffect(() => {
    target.current.set(...cameraViewFor(view, tierCount));
    remaining.current = 1.6;
  }, [view, nonce, tierCount]);

  useFrame((_, delta) => {
    if (remaining.current <= 0) return;
    remaining.current -= delta;
    camera.position.lerp(target.current, Math.min(1, 3.5 * delta));
    camera.lookAt(...CAMERA_TARGET);
  });

  return null;
}
CameraRig.propTypes = {
  view: PropTypes.string.isRequired,
  nonce: PropTypes.number.isRequired,
  tierCount: PropTypes.number.isRequired,
};

// ============================================
// SCENE
// ============================================

function Scene({ config, sliced, cameraView, viewNonce }) {
  const tierCount = TIER_OPTIONS[config.tiers]?.count || 1;
  return (
    <>
      <CameraRig view={cameraView} nonce={viewNonce} tierCount={tierCount} />

      <ambientLight intensity={0.35} />
      <hemisphereLight skyColor="#FFFAF0" groundColor="#E8D5C0" intensity={0.45} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.5}
        color="#FFF4E0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-near={1}
        shadow-camera-far={30}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight position={[-6, 4, -3]} intensity={0.5} color="#DCE9FF" />
      <spotLight position={[0, 9, -6]} intensity={0.9} angle={0.5} penumbra={0.8} color="#FFFFFF" />
      <Environment preset="apartment" environmentIntensity={0.55} />

      <PhotorealisticCakeModel config={config} sliced={sliced} />

      <ContactShadows
        position={[0, -0.9, 0]}
        opacity={0.35}
        scale={16}
        blur={2.4}
        far={4}
        resolution={1024}
        color="#7A5C45"
      />
    </>
  );
}
Scene.propTypes = {
  config: PropTypes.object.isRequired,
  sliced: PropTypes.bool.isRequired,
  cameraView: PropTypes.string.isRequired,
  viewNonce: PropTypes.number.isRequired,
};

// ============================================
// STEPPER
// ============================================

function Stepper({ steps, currentStep, onSelect }) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep);
  return (
    <nav className="px-3 pt-3 lg:px-4 lg:pt-4" aria-label="Design steps">
      <ol className="grid grid-cols-5 gap-1">
        {steps.map((step, i) => {
          const Icon = LucideIcons[step.icon] || LucideIcons.Circle;
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => onSelect(step.id)}
                aria-current={active ? "step" : undefined}
                className={`w-full flex flex-col items-center gap-1 rounded-xl px-1 py-2 text-[11px] font-medium transition-colors ${
                  active
                    ? "bg-accent text-white shadow-md"
                    : done
                      ? "text-accent hover:bg-accent/10"
                      : "text-dark/50 hover:bg-cream hover:text-dark"
                }`}
              >
                <span
                  className={`h-7 w-7 rounded-full flex items-center justify-center ${
                    active ? "bg-white/20" : done ? "bg-accent/10" : "bg-dark/5"
                  }`}
                >
                  {done ? <Check size={14} strokeWidth={3} /> : <Icon size={15} />}
                </span>
                <span className="truncate max-w-full">{step.short || step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
      <div className="mt-3 h-1 rounded-full bg-dark/5 overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
        />
      </div>
    </nav>
  );
}
Stepper.propTypes = {
  steps: PropTypes.array.isRequired,
  currentStep: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

// ============================================
// MAIN COMPONENT
// ============================================

export const CakeConfigurator = ({ onClose, initialConfig }) => {
  const [config, setConfig] = useState(() => ({ ...DEFAULT_CONFIG, ...(initialConfig || {}) }));
  const [currentStep, setCurrentStep] = useState(CONFIG_STEPS[0].id);
  const [peek, setPeek] = useState(false);
  const [cameraView, setCameraView] = useState("hero");
  const [viewNonce, setViewNonce] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const canvasRef = useRef(null);
  const addToCart = useCartStore((state) => state.addToCart);

  const priceLines = buildPriceLines(config);
  const totalPrice = priceLines.reduce((sum, l) => sum + l.amount, 0);
  const servings = SIZE_OPTIONS[config.size]?.serves || "";
  const sliced = peek || currentStep === "flavor";

  const updateConfig = useCallback((key, value) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  const goToView = useCallback((view) => {
    setCameraView(view);
    setViewNonce((n) => n + 1);
  }, []);

  useEffect(() => {
    goToView(VIEW_FOR_STEP[currentStep] || "hero");
  }, [currentStep, goToView]);

  const currentIndex = CONFIG_STEPS.findIndex((s) => s.id === currentStep);
  const stepMeta = CONFIG_STEPS[currentIndex];
  const isLast = currentIndex === CONFIG_STEPS.length - 1;

  const captureScreenshot = useCallback(() => {
    try {
      const canvas = canvasRef.current?.querySelector("canvas");
      if (!canvas) return null;
      const out = document.createElement("canvas");
      out.width = canvas.width;
      out.height = canvas.height;
      const ctx = out.getContext("2d");
      ctx.fillStyle = "#FFF6EA";
      ctx.fillRect(0, 0, out.width, out.height);
      ctx.drawImage(canvas, 0, 0);
      return out.toDataURL("image/jpeg", 0.85);
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      return null;
    }
  }, []);

  const downloadSnapshot = () => {
    const image = captureScreenshot();
    if (!image) {
      toast.error("Could not capture the preview. Please try again.");
      return;
    }
    const link = document.createElement("a");
    link.href = image;
    link.download = "sweetnest-custom-cake.jpg";
    link.click();
    toast.success("Preview image saved");
  };

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      const screenshot = captureScreenshot();
      const customId = `custom-${Date.now()}`;
      const weight = SIZE_OPTIONS[config.size].weight;
      const weightOption = {
        weight,
        unit: "kg",
        price: totalPrice,
        weightInKg: weight,
        _id: config.size,
      };

      const cartItem = {
        cakeId: customId,
        cake: {
          _id: customId,
          name: `Custom ${config.shape} ${config.flavor} Cake`,
          slug: `custom-${config.flavor.toLowerCase().replace(/\s+/g, "-")}-cake`,
          description: `${config.shape} • ${config.tiers} • ${config.size} • ${config.flavor} • ${config.color}`,
          basePrice: totalPrice,
          images: [
            {
              url: screenshot || FLAVOR_OPTIONS[config.flavor]?.image || "",
              alt: config.flavor,
              isScreenshot: !!screenshot,
            },
          ],
          category: { name: "Custom Cakes", slug: "custom-cakes" },
          isCustomizable: true,
          weightOptions: [weightOption],
        },
        quantity: 1,
        selectedWeight: weightOption,
        customization: {
          shape: config.shape,
          tiers: config.tiers,
          size: config.size,
          flavor: config.flavor,
          filling: config.filling,
          eggless: Boolean(config.eggless),
          color: config.color,
          frostingColorHex: COLOR_OPTIONS[config.color],
          drip: config.drip,
          topper: config.topper,
          finish: config.finish,
          candleNumber: config.candleNumber || "",
          message: config.message,
          photo: config.photo || null,
          priceLines,
          previewImage: screenshot,
        },
      };

      const result = await addToCart(cartItem, false);
      if (result.success) {
        toast.success("Custom cake added to cart!", { position: "top-right", autoClose: 3000 });
        setTimeout(() => onClose?.(), 500);
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

  const specLine1 = `${config.shape} · ${config.tiers} · ${config.size}`;
  const specLine2 = `${config.flavor}${config.eggless ? " (eggless)" : ""} · ${config.filling}`;

  const overlayBtn = (active) =>
    `h-8 w-8 rounded-lg shadow-md border border-dark/10 backdrop-blur-sm flex items-center justify-center transition-colors ${
      active ? "bg-accent text-white" : "bg-white/90 text-dark/70 hover:bg-cream"
    }`;

  return (
    <div className="fixed inset-0 z-50 bg-[#F7EFE6] flex flex-col overflow-hidden">
      {/* HEADER */}
      <header className="h-16 lg:h-[72px] px-4 lg:px-6 flex items-center justify-between bg-white/80 backdrop-blur border-b border-dark/10 flex-shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 text-dark/60 hover:text-dark transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium hidden sm:inline">Back</span>
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 text-center">
          <h1 className="font-heading text-lg lg:text-xl font-medium text-dark leading-tight">
            Design Your Cake
          </h1>
          <p className="hidden sm:block text-[11px] text-dark/50 -mt-0.5">
            Live 3D preview · baked to order
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-lg font-semibold text-accent leading-tight">{formatNPR(totalPrice)}</div>
            <div className="text-[11px] text-dark/50">Serves {servings}</div>
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="bg-accent text-white px-4 lg:px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md shadow-accent/20"
          >
            {isAddingToCart ? <Loader2 size={18} className="animate-spin" /> : <ShoppingBag size={18} />}
            <span className="hidden sm:inline">{isAddingToCart ? "Adding…" : "Add to Cart"}</span>
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 p-4 lg:p-5 overflow-y-auto lg:overflow-hidden">
        {/* STAGE */}
        <section
          ref={canvasRef}
          className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-xl shadow-dark/5 border border-white/60 h-[46vh] min-h-[320px] lg:h-auto lg:min-h-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 65% at 50% 38%, #FFFFFF 0%, #FFF6EA 45%, #F3DCC2 100%)",
          }}
        >
          <SceneErrorBoundary>
            <Suspense fallback={<LoadingFallback />}>
              <Canvas
                shadows="soft"
                dpr={[1, 2]}
                gl={{
                  antialias: true,
                  alpha: true,
                  powerPreference: "high-performance",
                  preserveDrawingBuffer: true,
                  toneMapping: THREE.ACESFilmicToneMapping,
                  toneMappingExposure: 1.3,
                  outputColorSpace: THREE.SRGBColorSpace,
                }}
                camera={{ fov: 40, near: 0.1, far: 100, position: [0, 4.2, 8.6] }}
                className="w-full h-full"
              >
                <Scene config={config} sliced={sliced} cameraView={cameraView} viewNonce={viewNonce} />
                <OrbitControls
                  enablePan={false}
                  target={CAMERA_TARGET}
                  autoRotate={autoRotate && currentStep !== "flavor"}
                  autoRotateSpeed={0.9}
                  enableDamping
                  dampingFactor={0.05}
                  rotateSpeed={0.5}
                  minPolarAngle={Math.PI / 9}
                  maxPolarAngle={Math.PI / 2.2}
                  minDistance={5}
                  maxDistance={16}
                />
              </Canvas>
            </Suspense>
          </SceneErrorBoundary>

          {/* Spec chips */}
          <div className="absolute top-4 left-4 hidden sm:flex flex-col gap-1.5 pointer-events-none">
            <span className="bg-dark/80 text-white text-[11px] font-medium px-3 py-1.5 rounded-full backdrop-blur-sm shadow">
              {specLine1}
            </span>
            <span className="bg-white/90 text-dark/80 text-[11px] font-medium px-3 py-1.5 rounded-full backdrop-blur-sm shadow border border-dark/5 w-fit">
              {specLine2}
            </span>
          </div>

          {/* View presets + tools */}
          <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
            <div className="flex rounded-lg overflow-hidden shadow-md border border-dark/10 bg-white/90 backdrop-blur-sm">
              {[
                ["hero", "Front"],
                ["side", "Side"],
                ["top", "Top"],
                ["slice", "Slice"],
              ].map(([view, label]) => (
                <button
                  key={view}
                  type="button"
                  onClick={() => goToView(view)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    cameraView === view ? "bg-accent text-white" : "text-dark/70 hover:bg-cream"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAutoRotate((a) => !a)}
                title={autoRotate ? "Pause turntable" : "Start turntable"}
                className={overlayBtn(autoRotate)}
              >
                {autoRotate ? <Pause size={14} /> : <RotateCw size={14} />}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPeek((p) => !p);
                  if (!peek) goToView("slice");
                }}
                title={peek ? "Close the cake" : "Peek inside"}
                className={overlayBtn(sliced)}
              >
                <Scissors size={14} />
              </button>
              <button
                type="button"
                onClick={downloadSnapshot}
                title="Save preview image"
                className={overlayBtn(false)}
              >
                <Download size={14} />
              </button>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white/85 backdrop-blur-sm px-3 py-1.5 rounded-full text-[11px] text-dark/60 pointer-events-none shadow border border-dark/5">
            Drag to rotate · Scroll to zoom
          </div>
        </section>

        {/* PANEL */}
        <aside className="lg:col-span-5 flex flex-col lg:min-h-0 bg-white rounded-3xl shadow-xl shadow-dark/5 border border-dark/5 overflow-hidden">
          <Stepper steps={CONFIG_STEPS} currentStep={currentStep} onSelect={setCurrentStep} />

          <div className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto px-4 py-5 lg:px-6">
            <div key={currentStep} className="animate-fadeIn space-y-5">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-dark/40 font-medium">
                  Step {currentIndex + 1} of {CONFIG_STEPS.length}
                </p>
                <h2 className="font-heading text-2xl text-dark leading-tight">{stepMeta.label}</h2>
                <p className="text-sm text-dark/50 mt-0.5">{stepMeta.description}</p>
              </div>

              {currentStep === "base" && <BaseStep config={config} update={updateConfig} />}
              {currentStep === "flavor" && (
                <FlavorStep config={config} update={updateConfig} peek={peek} setPeek={setPeek} />
              )}
              {currentStep === "frosting" && <FrostingStep config={config} update={updateConfig} />}
              {currentStep === "decorate" && <DecorateStep config={config} update={updateConfig} />}
              {currentStep === "personalize" && (
                <PersonalizeStep config={config} update={updateConfig} onError={(m) => toast.error(m)} />
              )}
            </div>
          </div>

          <footer className="border-t border-dark/10 bg-white px-4 py-3 lg:px-5 space-y-3">
            <button
              type="button"
              onClick={() => setShowDetails((s) => !s)}
              className="w-full flex items-center justify-between text-sm"
              aria-expanded={showDetails}
            >
              <span className="text-dark/60">
                Total <span className="font-semibold text-accent ml-1">{formatNPR(totalPrice)}</span>
                <span className="text-dark/40 ml-2">· serves {servings}</span>
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-dark/60">
                {showDetails ? "Hide" : "Details"}
                <ChevronDown size={14} className={`transition-transform ${showDetails ? "rotate-180" : ""}`} />
              </span>
            </button>
            {showDetails && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-cream/60 p-4 animate-fadeIn">
                <PriceBreakdown lines={priceLines} total={totalPrice} />
                <ConfigSummary config={config} />
              </div>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(CONFIG_STEPS[currentIndex - 1].id)}
                disabled={currentIndex === 0}
                className="flex-1 py-2.5 px-4 border border-dark/15 rounded-xl text-sm font-medium text-dark hover:border-dark/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Previous
              </button>
              {isLast ? (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="flex-[1.4] py-2.5 px-4 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-md shadow-accent/20"
                >
                  <ShoppingBag size={16} />
                  {isAddingToCart ? "Adding…" : `Add to cart · ${formatNPR(totalPrice)}`}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentStep(CONFIG_STEPS[currentIndex + 1].id)}
                  className="flex-[1.4] py-2.5 px-4 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2 shadow-md shadow-accent/20"
                >
                  Next: {CONFIG_STEPS[currentIndex + 1].label}
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </footer>
        </aside>
      </main>
    </div>
  );
};

CakeConfigurator.propTypes = {
  onClose: PropTypes.func,
  initialConfig: PropTypes.object,
};

export default CakeConfigurator;
