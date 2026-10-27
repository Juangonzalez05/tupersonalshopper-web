import type { Category, CategoryKey, Product } from "@/domain/product";

/**
 * Puerto de acceso al catálogo. Las páginas solo conocen esta interfaz; hoy la implementa
 * `data/static` (archivos del repo) y mañana podría implementarla Supabase o un CMS.
 * Los métodos son asíncronos para que ese cambio no obligue a tocar las páginas.
 */
export interface CatalogRepository {
  listProducts(): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByIds(ids: readonly string[]): Promise<Product[]>;
  listCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getCategory(key: CategoryKey): Promise<Category>;
  /** Productos parecidos: misma subcategoría primero, luego misma categoría. */
  getRelatedProducts(product: Product, limit: number): Promise<Product[]>;
}
