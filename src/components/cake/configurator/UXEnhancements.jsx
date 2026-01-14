import React, { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Download, Undo2, Redo2, Save, Share2, Wand2 } from "lucide-react";
import { toast } from "react-toastify";
import * as THREE from "three";

/**
 * UX ENHANCEMENT COMPONENTS
 * Undo/Redo, Screenshot, Quick Actions, etc.
 */

// ==================== UNDO/REDO SYSTEM ====================

/**
 * useUndoRedo Hook - Manages state history
 */
export function useUndoRedo(initialState, maxHistory = 50) {
  const [state, setState] = useState(initialState);
  const [history, setHistory] = useState([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const updateState = useCallback((newState) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push(newState);

      // Limit history size
      if (newHistory.length > maxHistory) {
        newHistory.shift();
        setCurrentIndex((prev) => prev - 1);
      }

      return newHistory;
    });

    setCurrentIndex((prev) => Math.min(prev + 1, maxHistory - 1));
    setState(newState);
  }, [currentIndex, maxHistory]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setState(history[newIndex]);
      return true;
    }
    return false;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setState(history[newIndex]);
      return true;
    }
    return false;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const reset = useCallback(() => {
    setHistory([initialState]);
    setCurrentIndex(0);
    setState(initialState);
  }, [initialState]);

  return {
    state,
    updateState,
    undo,
    redo,
    canUndo,
    canRedo,
    reset,
    historyLength: history.length,
    currentIndex,
  };
}

/**
 * Undo/Redo Control Buttons
 */
export function UndoRedoControls({ canUndo, canRedo, onUndo, onRedo }) {
  const handleUndo = () => {
    if (canUndo) {
      onUndo();
      toast.info("Undo", { autoClose: 1000 });
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      onRedo();
      toast.info("Redo", { autoClose: 1000 });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleUndo}
        disabled={!canUndo}
        className="p-2 rounded-lg border border-dark/20 bg-white hover:bg-accent/10 hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-dark/20 disabled:hover:text-dark"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 size={18} />
      </button>
      <button
        onClick={handleRedo}
        disabled={!canRedo}
        className="p-2 rounded-lg border border-dark/20 bg-white hover:bg-accent/10 hover:border-accent hover:text-accent transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-dark/20 disabled:hover:text-dark"
        title="Redo (Ctrl+Y)"
      >
        <Redo2 size={18} />
      </button>
    </div>
  );
}

UndoRedoControls.propTypes = {
  canUndo: PropTypes.bool.isRequired,
  canRedo: PropTypes.bool.isRequired,
  onUndo: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired,
};

// ==================== SCREENSHOT/DOWNLOAD ====================

/**
 * Screenshot functionality for Canvas
 */
export function useScreenshot() {
  const canvasRef = useRef(null);

  const captureScreenshot = useCallback(async (filename = "my-cake-design") => {
    try {
      const canvas = document.querySelector("canvas");
      if (!canvas) {
        throw new Error("Canvas not found");
      }

      // Convert canvas to blob
      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/png", 1.0);
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${filename}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Screenshot saved!", { autoClose: 2000 });
      return true;
    } catch (error) {
      console.error("Screenshot failed:", error);
      toast.error("Failed to save screenshot", { autoClose: 2000 });
      return false;
    }
  }, []);

  return { captureScreenshot };
}

/**
 * Screenshot Button Component
 */
export function ScreenshotButton({ cakeConfig }) {
  const { captureScreenshot } = useScreenshot();

  const handleScreenshot = () => {
    const filename = `cake-${cakeConfig.flavor}-${Date.now()}`;
    captureScreenshot(filename);
  };

  return (
    <button
      onClick={handleScreenshot}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dark/20 bg-white hover:bg-accent/10 hover:border-accent hover:text-accent transition-all text-sm font-medium"
      title="Download Design (PNG)"
    >
      <Download size={18} />
      <span className="hidden sm:inline">Screenshot</span>
    </button>
  );
}

ScreenshotButton.propTypes = {
  cakeConfig: PropTypes.object.isRequired,
};

// ==================== QUICK ACTIONS BAR ====================

/**
 * Quick Actions Floating Toolbar
 */
export function QuickActionsBar({
  onScreenshot,
  onSave,
  onShare,
  onRandomize,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
      <div className="bg-white/95 backdrop-blur-md rounded-full shadow-xl border border-dark/10 px-2 py-2 flex items-center gap-2">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 pr-2 border-r border-dark/10">
          <UndoRedoControls
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={onUndo}
            onRedo={onRedo}
          />
        </div>

        {/* Screenshot */}
        <button
          onClick={onScreenshot}
          className="p-2 rounded-full hover:bg-accent/10 hover:text-accent transition-all"
          title="Download Screenshot"
        >
          <Download size={18} />
        </button>

        {/* Save Design */}
        <button
          onClick={onSave}
          className="p-2 rounded-full hover:bg-accent/10 hover:text-accent transition-all"
          title="Save Design"
        >
          <Save size={18} />
        </button>

        {/* Share */}
        <button
          onClick={onShare}
          className="p-2 rounded-full hover:bg-accent/10 hover:text-accent transition-all"
          title="Share Design"
        >
          <Share2 size={18} />
        </button>

        {/* Randomize */}
        <button
          onClick={onRandomize}
          className="p-2 rounded-full hover:bg-accent/10 hover:text-accent transition-all border-l border-dark/10 pl-3 ml-1"
          title="Random Design"
        >
          <Wand2 size={18} />
        </button>
      </div>
    </div>
  );
}

QuickActionsBar.propTypes = {
  onScreenshot: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onShare: PropTypes.func.isRequired,
  onRandomize: PropTypes.func.isRequired,
  canUndo: PropTypes.bool.isRequired,
  canRedo: PropTypes.bool.isRequired,
  onUndo: PropTypes.func.isRequired,
  onRedo: PropTypes.func.isRequired,
};

// ==================== DESIGN TEMPLATES ====================

/**
 * Pre-made Design Templates
 */
export const DESIGN_TEMPLATES = {
  classic: {
    name: "Classic Elegance",
    description: "Traditional white cake with gold accents",
    config: {
      tiers: "2 Tiers",
      size: "2 kg",
      flavor: "Vanilla",
      color: "Classic White",
      topper: "Edible Flowers",
      message: "",
      effects: {
        drip: false,
        ribbon: false,
        metallic: "gold",
        ombre: false,
      },
    },
    occasion: "Wedding",
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d",
  },
  birthday: {
    name: "Birthday Celebration",
    description: "Colorful and fun with drips and sparkles",
    config: {
      tiers: "2 Tiers",
      size: "1.5 kg",
      flavor: "Chocolate",
      color: "Pastel Pink",
      topper: "Candles",
      message: "Happy Birthday!",
      effects: {
        drip: true,
        dripType: "chocolate",
        ribbon: true,
        ribbonColor: "#E74C3C",
        metallic: false,
        ombre: false,
      },
    },
    occasion: "Birthday",
    image: "https://images.unsplash.com/photo-1558636508-e0db3814bd1d",
  },
  romantic: {
    name: "Romantic Rose",
    description: "Red velvet with ombre pink and roses",
    config: {
      tiers: "3 Tiers",
      size: "3 kg",
      flavor: "Red Velvet",
      color: "Pastel Pink",
      topper: "Edible Flowers",
      message: "With Love",
      effects: {
        drip: false,
        ribbon: true,
        ribbonColor: "#E74C3C",
        metallic: "rose-gold",
        ombre: true,
        ombreTop: "#FFB7C5",
        ombreBottom: "#C21E56",
      },
    },
    occasion: "Anniversary",
    image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d",
  },
  luxury: {
    name: "Gold Luxury",
    description: "Elegant gold with macarons",
    config: {
      tiers: "3 Tiers",
      size: "3 kg",
      flavor: "Vanilla",
      color: "Cream",
      topper: "Macarons",
      message: "",
      effects: {
        drip: true,
        dripType: "caramel",
        ribbon: false,
        metallic: "gold",
        ombre: false,
      },
    },
    occasion: "Special Event",
    image: "https://images.unsplash.com/photo-1562440499-64c9a111f713",
  },
  chocolate: {
    name: "Chocolate Dream",
    description: "Rich chocolate with drips and berries",
    config: {
      tiers: "2 Tiers",
      size: "2 kg",
      flavor: "Chocolate",
      color: "Golden",
      topper: "Fresh Fruits",
      message: "",
      effects: {
        drip: true,
        dripType: "chocolate",
        dripIntensity: "heavy",
        ribbon: false,
        metallic: false,
        ombre: false,
      },
    },
    occasion: "Any Celebration",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
  },
};

/**
 * Template Selector Component
 */
export function TemplateSelector({ onSelectTemplate, onClose }) {
  const templates = Object.entries(DESIGN_TEMPLATES);

  return (
    <div className="fixed inset-0 z-50 bg-dark/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-dark/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-medium text-dark">Design Templates</h2>
              <p className="text-sm text-dark/60 mt-1">
                Start with a pre-made design and customize it
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark/10 rounded-lg transition-colors"
            >
              <span className="text-2xl text-dark/60">×</span>
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(([key, template]) => (
              <button
                key={key}
                onClick={() => onSelectTemplate(template.config)}
                className="group text-left bg-cream rounded-xl overflow-hidden border border-dark/10 hover:border-accent hover:shadow-lg transition-all"
              >
                {/* Template Image */}
                <div className="aspect-square bg-gradient-to-br from-cream to-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-dark/5 group-hover:bg-accent/10 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-4xl">🎂</div>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <h3 className="font-medium text-dark mb-1">{template.name}</h3>
                  <p className="text-xs text-dark/60 mb-2">{template.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                      {template.occasion}
                    </span>
                    <span className="text-xs text-dark/50">
                      {template.config.tiers}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-dark/10 bg-cream/50">
          <button
            onClick={onClose}
            className="w-full py-3 border border-dark/20 rounded-lg text-sm font-medium text-dark hover:bg-dark/5 transition-colors"
          >
            Start from Scratch Instead
          </button>
        </div>
      </div>
    </div>
  );
}

TemplateSelector.propTypes = {
  onSelectTemplate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

// ==================== KEYBOARD SHORTCUTS ====================

/**
 * Keyboard Shortcuts Hook
 */
export function useKeyboardShortcuts({ onUndo, onRedo, onScreenshot, onSave }) {
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo();
      }

      // Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z = Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        onRedo();
      }

      // Ctrl/Cmd + P = Screenshot
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        onScreenshot();
      }

      // Ctrl/Cmd + S = Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSave();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo, onScreenshot, onSave]);
}
