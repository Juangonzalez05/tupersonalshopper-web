import { describe, expect, it } from "vitest";
import { curation } from "@/data/static/curation";
import { products } from "@/data/static/products";
import { buildMarqueeItems } from "./marquee-items";

describe("buildMarqueeItems", () => {
  const items = buildMarqueeItems(products, curation.marquee);
  const byId = Object.fromEntries(items.map((item) => [item.id, item]));

  it("arma un ítem por entrada, con el enlace y la foto del producto", () => {
    expect(items).toHaveLength(curation.marquee.length);
    for (const item of items) {
      expect(item.href).toMatch(/^\/producto\/[a-z0-9-]+$/);
      expect(item.image).toMatch(/^\/img\/p\/.+\.webp$/);
    }
  });

  it("usa el título propio de la entrada o, si no hay, el nombre del producto", () => {
    expect(byId.g1?.title).toBe("Gorra Polo clásica");
    expect(byId.p01?.title).toBe("Crema Vanilla Cashmere");
  });

  it("trae la marca del producto para mostrarla en su propia fila", () => {
    expect(byId.f04?.brand).toBe("Medicube");
    expect(byId.p01?.brand).toBe("eos");
  });

  it("no repite la marca dentro del título", () => {
    for (const item of items) {
      if (item.brand) expect(item.title.toLowerCase()).not.toContain(item.brand.toLowerCase());
    }
  });

  it("omite la marca cuando todavía está por confirmar", () => {
    const [item] = buildMarqueeItems(products, [{ id: "b07", tag: "nuevo" }]);
    expect(item?.brand).toBeUndefined();
  });

  it("falla si una entrada apunta a un producto que no existe", () => {
    expect(() => buildMarqueeItems(products, [{ id: "no-existe", tag: "nuevo" }])).toThrow(
      /no-existe/,
    );
  });
});
