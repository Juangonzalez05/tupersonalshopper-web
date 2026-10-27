import { describe, expect, it } from "vitest";
import { curation, editorial } from "./curation";
import { products } from "./products";
import { categories } from "./categories";
import { defaultSelections, missingSelections } from "@/domain/product";

const ids = new Set(products.map((p) => p.id));

describe("catálogo estático", () => {
  it("tiene 69 productos con id y slug únicos", () => {
    expect(products).toHaveLength(69);
    expect(ids.size).toBe(69);
    expect(new Set(products.map((p) => p.slug)).size).toBe(69);
  });

  it("cada producto tiene al menos una foto generada", () => {
    const withoutImages = products.filter((p) => p.images.length === 0).map((p) => p.slug);
    expect(withoutImages).toEqual([]);
  });

  it("las fotos de variante corresponden a opciones existentes", () => {
    for (const product of products) {
      const values = new Set(product.variants.flatMap((g) => g.options.map((o) => o.value)));
      for (const image of product.images) {
        if (image.variant)
          expect(values, `${product.slug}: ${image.variant}`).toContain(image.variant);
      }
    }
  });

  it("los conteos por categoría coinciden con el diseño", () => {
    const count = (key: string) => products.filter((p) => p.category === key).length;
    expect(categories.map((c) => [c.key, count(c.key)])).toEqual([
      ["beauty", 10],
      ["face", 4],
      ["body", 14],
      ["health", 17],
      ["fashion", 21],
      ["home", 1],
      ["snack", 2],
    ]);
  });

  it("solo el grupo principal queda por elegir en la selección inicial", () => {
    for (const product of products) {
      const missing = missingSelections(product, defaultSelections(product));
      expect(missing.every((g) => g === product.variants[0])).toBe(true);
    }
  });

  it("las selecciones editoriales apuntan a productos existentes", () => {
    const referenced = [
      ...curation.home.newArrivals,
      ...curation.home.trending,
      ...curation.home.marquee.map((m) => m.id),
      ...curation.home.collage.small,
      ...Object.values(curation.trends).flatMap((v) => (Array.isArray(v) ? v : [])),
      ...editorial.lookbook.map((l) => l.productId),
    ];
    expect(referenced.filter((id) => !ids.has(id))).toEqual([]);
  });
});
