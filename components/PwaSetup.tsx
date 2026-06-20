"use client";

import { useEffect } from "react";

export default function PwaSetup() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // PWA is an enhancement. The site remains fully usable if registration fails.
      });
    });
  }, []);

  return null;
}

