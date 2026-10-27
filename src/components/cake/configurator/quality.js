import { createContext, useContext } from "react";

/**
 * Whether to draw a lighter 3D scene. Phones and weaker machines get cheaper lighting, no real-time shadows,
 * simpler materials and a lower pixel density; the picture stays the same cake, with less GPU work behind it.
 *
 * "Weak" is judged from what the browser tells us: a touch screen, little memory (4 GB or less), or two or fewer
 * CPU cores. Any one of them is enough, because a slow phone is slow whatever its other numbers say. (Four-core
 * laptops are not treated as weak.)
 */
export function isLiteDevice(env = {}) {
  const { coarsePointer = false, deviceMemory, hardwareConcurrency } = env;
  if (coarsePointer) return true;
  if (typeof deviceMemory === "number" && deviceMemory <= 4) return true;
  if (typeof hardwareConcurrency === "number" && hardwareConcurrency <= 2) return true;
  return false;
}

/** Reads the current browser. Safe to call where there is no window (it then reports a full-quality device). */
export function detectLite() {
  if (typeof window === "undefined") return false;
  return isLiteDevice({
    coarsePointer: window.matchMedia?.("(pointer: coarse)")?.matches ?? false,
    deviceMemory: navigator.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
  });
}

/** Provided inside the Canvas (React context does not cross into the 3D scene from outside it). */
export const QualityContext = createContext({ lite: false });
export const useQuality = () => useContext(QualityContext);
