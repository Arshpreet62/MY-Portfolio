"use client";

import { useEffect } from "react";

export function CursorPet() {
  useEffect(() => {
    const canTrack =
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!canTrack) return;

    const w = window as Window & { __onekoCleanup?: (() => void) | null };

    // If already active (e.g. route remount), don't inject again.
    if (w.__onekoCleanup) {
      return () => {
        w.__onekoCleanup?.();
      };
    }

    // Load oneko.js script
    const script = document.createElement("script");
    script.src = "/oneko.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      w.__onekoCleanup?.();
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
}
