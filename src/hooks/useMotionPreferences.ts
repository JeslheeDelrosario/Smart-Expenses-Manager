import { useEffect } from "react";
import { usePreferences } from "./usePreferences";

export function useMotionPreferences() {
  const { preferences } = usePreferences();

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reducedMotion = media.matches || !preferences.animations_enabled;
    document.documentElement.style.setProperty(
      "--motion-scale",
      reducedMotion ? "0" : "1",
    );
  }, [preferences.animations_enabled]);

  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches && preferences.animations_enabled;
}
