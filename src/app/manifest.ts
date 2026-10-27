import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.name,
    description: site.description,
    lang: "es-CO",
    start_url: "/",
    display: "standalone",
    background_color: "#FBFAF6",
    theme_color: "#0B1431",
    icons: [
      { src: "/brand/pwa-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/pwa-512x512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/brand/maskable-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
