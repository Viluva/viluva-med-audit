import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.viluva.app/sitemap.xml",
    host: "https://www.viluva.app",
  };
}
