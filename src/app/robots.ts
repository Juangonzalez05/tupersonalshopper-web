import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Las vistas previas de Vercel no se indexan; solo producción.
  const isPreview = process.env.VERCEL_ENV !== undefined && process.env.VERCEL_ENV !== "production";
  return {
    rules: isPreview
      ? [{ userAgent: "*", disallow: "/" }]
      : [{ userAgent: "*", allow: "/", disallow: ["/mi-pedido"] }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
