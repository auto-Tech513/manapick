import type { Metadata, Viewport } from "next";
import Script from "next/script";
import PwaSetup from "@/components/PwaSetup";
import { MANAPICK_AI_URL } from "@/lib/brand-links";
import SiteFooter from "@/components/SiteFooter";
import SiteBottomNav from "@/components/SiteBottomNav";
import { absoluteUrl, SITE_URL } from "@/lib/manapick";
import "./globals.css";

const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID?.trim();
const ogImageUrl = absoluteUrl("/brand/ogp-manapick.png");
const xAccountUrl = "https://x.com/manapick_app";
const xAccountHandle = "@manapick_app";

const commonJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: "Manapick",
      url: absoluteUrl("/"),
      logo: absoluteUrl("/brand/manapick-logo-master.png"),
      sameAs: [xAccountUrl, MANAPICK_AI_URL],
      subOrganization: {
        "@type": "Organization",
        name: "manapick AI",
        url: MANAPICK_AI_URL
      }
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      name: "Manapick",
      url: absoluteUrl("/"),
      description: "社会人のリスキリングに役立つYouTube学習動画を、独自3行レビューとロードマップでキュレーションするメディア。",
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
    "社会人のリスキリングに役立つYouTube学習動画を、独自3行レビューとロードマップでキュレーションするメディア。",
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.webmanifest",
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
        <link rel="preconnect" href="https://i.ytimg.com" />
        {adsenseId ? (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(adsenseId)}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(commonJsonLd).replace(/</g, "\\u003c") }}
        />
        {gaId ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`} strategy="afterInteractive" />
            <Script
              id="ga4-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: [
                  "window.dataLayer = window.dataLayer || [];",
                  "function gtag(){dataLayer.push(arguments);}",
                  "gtag('js', new Date());",
                  `gtag('config', ${JSON.stringify(gaId)});`
                ].join("\n")
              }}
            />
          </>
        ) : null}
        <PwaSetup />
        {children}
        <SiteFooter />
        <SiteBottomNav />
      </body>
    </html>
  );
}
