import type { Metadata } from "next";
import ManapickApp from "@/components/ManapickApp";
import { absoluteUrl, videoPath, videos } from "@/lib/manapick";

const homeTitle = "Manapick | 学び直しを、最短ルートに。";
const homeDescription = "社会人のリスキリングに役立つYouTube学習動画を、独自3行レビューとロードマップでキュレーションするメディア。";
const homeOgImage = absoluteUrl("/brand/ogp-manapick.png");

export const metadata: Metadata = {
  title: homeTitle,
  description: homeDescription,
  alternates: {
    canonical: absoluteUrl("/")
  },
  openGraph: {
    title: homeTitle,
    description: homeDescription,
    url: absoluteUrl("/"),
    type: "website",
    images: [
      {
        url: homeOgImage,
        width: 1200,
        height: 630,
        alt: "Manapick - 学び直しを、最短ルートに。"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: homeTitle,
    description: homeDescription,
    images: [homeOgImage]
  }
};

export default function Home() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Manapick 学習動画一覧",
    itemListElement: videos.map((video, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(videoPath(video.ytid)),
      name: video.title
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replace(/</g, "\\u003c") }}
      />
      <ManapickApp />
    </>
  );
}
