import type { CatalogRepository } from "../catalog-repository";
import { categories, categoryByKey } from "./categories";
import { products } from "./products";

const bySlug = new Map(products.map((p) => [p.slug, p]));
const byId = new Map(products.map((p) => [p.id, p]));

export const staticCatalog: CatalogRepository = {
  async listProducts() {
    return products;
  },
  async getProductBySlug(slug) {
    return bySlug.get(slug);
  },
  async getProductsByIds(ids) {
    return ids.flatMap((id) => byId.get(id) ?? []);
  },
  async listCategories() {
    return categories;
  },
  async getCategoryBySlug(slug) {
    return categories.find((c) => c.slug === slug);
  },
  async getCategory(key) {
    return categoryByKey[key];
  },
  async getRelatedProducts(product, limit) {
    const others = products.filter((p) => p.id !== product.id);
    const sameSub = others.filter((p) => p.subcategory === product.subcategory);
    const sameCategory = others.filter(
      (p) => p.category === product.category && p.subcategory !== product.subcategory,
    );
    return [...sameSub, ...sameCategory].slice(0, limit);
  },
};
