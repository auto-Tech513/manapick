"use client";

import { useState } from "react";

type NewsShareBarProps = {
  title: string;
  url: string;
};

export default function NewsShareBar({ title, url }: NewsShareBarProps) {
  const [copied, setCopied] = useState(false);
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);

  async function share() {
    if (navigator.share) {
      await navigator.share({ title, url });
      return;
    }
    await copyUrl();
  }

  async function copyUrl() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="news-share-bar" aria-label="この記事を共有">
      <div>
        <strong>あとで読める場所へ</strong>
        <span>共有先を選べます</span>
      </div>
      <div className="news-share-actions">
        <button type="button" className="is-primary" onClick={share}>共有</button>
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          X
        </a>
        <a
          href={`https://social-plugins.line.me/lineit/share?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          LINE
        </a>
        <button type="button" onClick={copyUrl}>{copied ? "コピー済み" : "URLコピー"}</button>
      </div>
    </div>
  );
}
