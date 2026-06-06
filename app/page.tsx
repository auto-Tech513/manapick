import ManapickApp from "@/components/ManapickApp";
import { absoluteUrl, videoPath, videos } from "@/lib/manapick";

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
