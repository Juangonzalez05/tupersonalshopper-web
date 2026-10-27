import { UNKNOWN_BRAND, productPath, type Product, type ProductTag } from "@/domain/product";
import type { MarqueeEntry } from "@/data";

export interface MarqueeItem {
  id: string;
  tag: ProductTag;
  title: string;
  /** Marca del producto; no se incluye si todavía está por confirmar. */
  brand?: string;
  href: string;
  image: string;
}

/**
 * Convierte las entradas editoriales de `curation.marquee` en los ítems de la cinta superior,
 * tomando del catálogo el enlace, la foto y la marca. Falla (en el build) si una entrada apunta
 * a un producto que no existe o que no tiene foto.
 */
export function buildMarqueeItems(
  products: readonly Product[],
  entries: readonly MarqueeEntry[],
): MarqueeItem[] {
  const byId = new Map(products.map((product) => [product.id, product]));
  return entries.map((entry) => {
    const product = byId.get(entry.id);
    if (!product) throw new Error(`Marquesina: el producto "${entry.id}" no existe en el catálogo`);
    const image = product.images[0];
    if (!image) throw new Error(`Marquesina: el producto "${entry.id}" no tiene foto`);
    return {
      id: product.id,
      tag: entry.tag,
      title: entry.title ?? product.name,
      ...(product.brand !== UNKNOWN_BRAND ? { brand: product.brand } : {}),
      href: productPath(product),
      image: image.src,
    };
  });
}
