import type { Metadata, Viewport } from "next";
import Script from "next/script";
import AdSenseScript from "@/components/AdSenseScript";
import PwaSetup from "@/components/PwaSetup";
import { MANAPICK_AI_URL, MANAPICK_CAREER_URL, MANAPICK_COMPANY_ORIGIN, MANAPICK_LICENSE_URL } from "@/lib/brand-links";
import SiteFooter from "@/components/SiteFooter";
import SiteBottomNav from "@/components/SiteBottomNav";
import NetworkRail from "@/components/NetworkRail";
import NetworkClickTracker from "@/components/NetworkClickTracker";
import { absoluteUrl, SITE_URL } from "@/lib/manapick";
import "./globals.css";
import "./lookbook.css";

const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim() || "G-13BNL4Q41Z";
const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID?.trim() || "ca-pub-4108900975353940";
const ogImageUrl = absoluteUrl("/brand/ogp-manapick.png");
const xAccountUrl = "https://x.com/manapick_app";
const youtubeAccountUrl = "https://www.youtube.com/@Manapick_app";
const instagramAccountUrl = "https://www.instagram.com/manapick_app/";
const lineAccountUrl = "https://lin.ee/5DpH9VV";
const xAccountHandle = "@manapick_app";
const googleFontsHref =
  "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,600;1,500&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Zen+Old+Mincho:wght@500;700;900&display=swap";
// 描画を止めない読み込み：script で追加した stylesheet は描画をブロックしない。取得は上の preload が先に始めている
const loadGoogleFontsScript = [
  "(function(){",
  `var h=${JSON.stringify(googleFontsHref)};`,
  "var l=document.createElement('link');",
  "l.rel='stylesheet';",
  "l.href=h;",
  "document.head.appendChild(l);",
  "})();"
].join("");

const commonJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: "Manapick",
      url: absoluteUrl("/"),
      logo: absoluteUrl("/brand/manapick-logo-master.png"),
      sameAs: [xAccountUrl, youtubeAccountUrl, instagramAccountUrl, lineAccountUrl, MANAPICK_AI_URL, MANAPICK_LICENSE_URL, MANAPICK_CAREER_URL, MANAPICK_COMPANY_ORIGIN],
      subOrganization: [
        {
          "@type": "Organization",
          name: "manapick AI",
          url: MANAPICK_AI_URL
        },
        {
          "@type": "Organization",
          name: "manapick license",
          url: MANAPICK_LICENSE_URL
        },
        {
          "@type": "Organization",
          name: "manapick career",
          url: MANAPICK_CAREER_URL
        },
        {
          "@type": "Organization",
          name: "manapick company",
          url: MANAPICK_COMPANY_ORIGIN
        }
      ]
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      name: "Manapick",
      url: absoluteUrl("/"),
      description: "社会人の学び直し・リスキリングに役立つ無料YouTube学習動画を、独自の7軸35点採点レビューとレベル別の見る順（ロードマップ）で整理するメディア。生成AI・プログラミング・資格・英語・お金など10ジャンルを、初級から上級まで登録不要・全部無料で案内します。",
      publisher: {
        "@id": absoluteUrl("/#organization")
      },
      inLanguage: "ja"
    }
  ]
};

export const metadata: Metadata = {
  title: "Manapick | 学び直しを、最短ルートに。",
  description:
    "社会人の学び直し・リスキリングに役立つ無料YouTube学習動画を、独自の7軸35点採点レビューとレベル別の見る順（ロードマップ）で整理するメディア。生成AI・プログラミング・資格・英語・お金など10ジャンルを、初級から上級まで登録不要・全部無料で案内します。",
  metadataBase: new URL(SITE_URL),
  // Google Discoverの大きな画像表示は max-image-preview:large で有効になる（Google検索セントラル）。
  // noindexが必要なページ（/my/ など）は各ページのrobots指定で上書きされる。
  // Bing は name="robots" の max-image-preview 等を読む（googleBot だけでは Bing に伝わらない）。
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Manapick",
    statusBarStyle: "default"
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  openGraph: {
    title: "Manapick",
    description: "学び直しを、最短ルートに。",
    url: absoluteUrl("/"),
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Manapick - 学び直しを、最短ルートに。"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: xAccountHandle,
    title: "Manapick",
    description: "学び直しを、最短ルートに。",
    images: [ogImageUrl]
  }
};

export const viewport: Viewport = {
  themeColor: "#1F3A8A",
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {adsenseId ? <meta name="google-adsense-account" content={adsenseId} /> : null}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Google Fonts の CSS（約 800KB・@font-face 869個）が最初の描画を止めないよう、先に取得だけ始め（preload）、
            stylesheet としての適用は script で後から行う（2026-11-24 オーナー判断。書体・太さ・display=swap は変えない）。
            JavaScript が無効の環境は noscript の stylesheet で従来どおり読み込む */}
        <link rel="preload" as="style" href={googleFontsHref} />
        <script dangerouslySetInnerHTML={{ __html: loadGoogleFontsScript }} />
        <noscript>
          <link rel="stylesheet" href={googleFontsHref} />
        </noscript>
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="alternate" type="application/rss+xml" title="Manapick 学びニュース" href="/news-feed.xml" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(commonJsonLd).replace(/</g, "\\u003c") }}
        />
        {gaId ? (
          <>
            {/* 自動操作のブラウザ（Playwright・Selenium 等。navigator.webdriver === true）では gtag.js を読み込まず config もしない
                （自動確認が GA4 に記録されないように。2026-11-21 ANALYTICS_BRIEF）。通常の閲覧では false なので従来どおり */}
            <Script
              id="ga4-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: [
                  "window.dataLayer = window.dataLayer || [];",
                  "function gtag(){dataLayer.push(arguments);}",
                  "(function(){",
                  "if (navigator.webdriver === true) return;",
                  "gtag('js', new Date());",
                  `gtag('config', ${JSON.stringify(gaId)});`,
                  "var s = document.createElement('script');",
                  "s.async = true;",
                  `s.src = ${JSON.stringify(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`)};`,
                  "document.head.appendChild(s);",
                  "})();"
                ].join("\n")
              }}
            />
          </>
        ) : null}
        {adsenseId ? <AdSenseScript client={adsenseId} /> : null}
        <PwaSetup />
        <NetworkClickTracker />
        <NetworkRail />
        {children}
        <SiteFooter />
        <SiteBottomNav />
      </body>
    </html>
  );
}
