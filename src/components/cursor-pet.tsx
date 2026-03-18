"use client";

import { useEffect } from "react";

export function CursorPet() {
  useEffect(() => {
    const canTrack =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canTrack) return;

    // Load oneko.js script
    const script = document.createElement("script");
    script.src = "/oneko.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup: remove oneko element if it exists
      const onekoEl = document.getElementById("oneko");
      if (onekoEl) {
        onekoEl.remove();
      }
    };
  }, []);

  return null;
}
