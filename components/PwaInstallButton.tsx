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
  const [platform, setPlatform] = useState<"ios-safari" | "ios-other" | "other">("other");

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone;
    const ua = navigator.userAgent;
    // iPadOS は Mac と同じ UA を返すため、タッチ対応の有無で判定する。
    const isIos = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isOtherIosBrowser = /CriOS|FxiOS|EdgiOS|OPiOS|Line\/|Instagram|FBAN|FBAV|GSA\//.test(ua);
    const installedTimer = window.setTimeout(() => {
      setInstalled(Boolean(standalone));
      setPlatform(isIos ? (isOtherIosBrowser ? "ios-other" : "ios-safari") : "other");
    }, 0);

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
          {platform === "ios-safari" ? (
            <>
              <strong>iPhone・iPadのSafariで追加する手順</strong>
              <ol>
                <li>画面のページメニューボタンをタップしてから「共有」をタップします（タブレイアウトが「下」または「上」の場合は共有ボタンをタップ）。</li>
                <li>オプションのリストを下にスクロールして「ホーム画面に追加」をタップします。表示されない場合は、一番下の「アクションを編集」から追加できます。</li>
                <li>「ウェブアプリとして開く」を選ぶと、アプリのように使えます。最後に「追加」をタップします。</li>
              </ol>
              <small>手順はApple公式の「iPhoneユーザガイド」に基づいています。iOSのバージョンによって表示が異なる場合があります。</small>
            </>
          ) : platform === "ios-other" ? (
            <>
              <strong>Safariで開いてから追加してください</strong>
              <span>Apple公式の手順はSafariでの操作です。このページをSafariで開き、もう一度「ホーム画面に追加」を押すと手順が表示されます。</span>
            </>
          ) : (
            <span>ブラウザのメニューから「ホーム画面に追加」または「アプリをインストール」を選ぶと、すぐ開けます。</span>
          )}
        </span>
      ) : null}
    </span>
  );
}
