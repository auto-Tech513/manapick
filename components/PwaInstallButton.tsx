"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function PwaInstallButton({ className = "" }: { className?: string }) {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone;
    const installedTimer = window.setTimeout(() => setInstalled(Boolean(standalone)), 0);

    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    }

    function handleInstalled() {
      setInstalled(true);
      setPromptEvent(null);
      setHintVisible(false);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.clearTimeout(installedTimer);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  if (installed) return null;

  async function handleClick() {
    if (promptEvent) {
      await promptEvent.prompt();
      await promptEvent.userChoice.catch(() => undefined);
      setPromptEvent(null);
      return;
    }
    setHintVisible((visible) => !visible);
  }

  return (
    <span className={["pwa-install-wrap", className].filter(Boolean).join(" ")}>
      <button type="button" className="pwa-install-button" onClick={handleClick}>
        ホーム画面に追加
      </button>
      {hintVisible ? (
        <span className="pwa-install-hint" role="status">
          ブラウザの共有メニューから「ホーム画面に追加」を選ぶと、すぐ開けます。
        </span>
      ) : null}
    </span>
  );
}
