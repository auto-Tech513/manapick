import type { Metadata, Viewport } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Manapick | 学び直しを、最短ルートに。",
  description:
    "社会人のリスキリングに役立つYouTube学習動画を、独自3行レビューとロードマップでキュレーションするメディア。",
  metadataBase: new URL("https://manapick.pages.dev"),
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
    type: "website",
    images: [
      {
        url: "/brand/ogp-manapick.png",
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
    images: ["/brand/ogp-manapick.png"]
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
      <body>{children}</body>
    </html>
  );
}
