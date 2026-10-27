import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { catalog } from "@/data";
import { categoryPath, productPath } from "@/domain/product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    catalog.listProducts(),
    catalog.listCategories(),
  ]);
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${site.url}${path}`,
    changeFrequency: "weekly",
    priority,
  });
  return [
    page("/", 1),
    page("/catalogo", 0.9),
    page("/coleccion-polo", 0.9),
    page("/tendencias", 0.8),
    page("/encargos", 0.7),
    page("/como-funciona", 0.6),
    page("/politica-de-datos", 0.2),
    ...categories.map((category) => page(categoryPath(category.key), 0.8)),
    ...products.map((product) => ({
      ...page(productPath(product), 0.7),
      images: product.images.map((image) => `${site.url}${image.src}`),
    })),
  ];
}
