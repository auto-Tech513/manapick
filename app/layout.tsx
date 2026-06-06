import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { absoluteUrl, SITE_URL } from "@/lib/manapick";
import "./globals.css";

const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim();
const ogImageUrl = absoluteUrl("/brand/ogp-manapick.png");

const commonJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: "Manapick",
      url: absoluteUrl("/"),
      logo: absoluteUrl("/brand/manapick-logo-master.png"),
      sameAs: []
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
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" }
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
    title: "Manapick",
    description: "学び直しを、最短ルートに。",
    images: [ogImageUrl]
  }
};

export const viewport: Viewport = {
  themeColor: "#1F3A8A"
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
        {children}
      </body>
    </html>
  );
}
