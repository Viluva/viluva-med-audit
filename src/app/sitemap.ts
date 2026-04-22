import type { MetadataRoute } from "next";
import { sitemapLinks } from "@/lib/siteLinks";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return sitemapLinks.map((link) => ({
    url: `https://www.viluva.app${link.href}`,
    lastModified,
    changeFrequency: link.href === "/" ? "weekly" : "monthly",
    priority: link.priority,
  }));
}
