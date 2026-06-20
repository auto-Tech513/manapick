import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/manapick";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/my/"
    },
    sitemap: absoluteUrl("/sitemap.xml")
  };
}
