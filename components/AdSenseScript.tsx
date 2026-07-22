"use client";

import { useEffect } from "react";

const SCRIPT_ID = "adsense-script";

export default function AdSenseScript({ client }: { client: string }) {
  useEffect(() => {
    if (window.location.hostname !== "manapick.app" || document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    document.head.appendChild(script);
  }, [client]);

  return null;
}
