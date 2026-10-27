import { describe, expect, it } from "vitest";
import { products } from "@/data/static/products";
import { catalogFacets, parseTags, queryCatalog } from "./catalog-query";
import { queryPolo, poloLineCounts } from "./polo";

describe("queryCatalog", () => {
  it("sin filtros devuelve todo en orden recomendado", () => {
    const result = queryCatalog(products, {});
    expect(result).toHaveLength(69);
    expect(result[0]?.id).toBe("f04");
  });

  it("combina categoría y marca", () => {
    const result = queryCatalog(products, { category: "face", brand: "Medicube" });
    expect(result.map((p) => p.id).sort()).toEqual(["f01", "f02", "f03", "f04"]);
  });

  it("busca sin importar tildes ni mayúsculas", () => {
    expect(queryCatalog(products, { q: "SERUM" }).map((p) => p.id)).toEqual(["f04"]);
    expect(queryCatalog(products, { q: "polo pique" }).length).toBeGreaterThanOrEqual(3);
  });

  it("filtra por valor inicial", () => {
    const withPrice = queryCatalog(products, { price: "con" });
    expect(withPrice.map((p) => p.id).sort()).toEqual(["g1", "v1", "v2", "v3"]);
    expect(
      queryCatalog(products, { price: "lt200" })
        .map((p) => p.id)
        .sort(),
    ).toEqual(["v1", "v2", "v3"]);
    expect(queryCatalog(products, { price: "200300" }).map((p) => p.id)).toEqual(["g1"]);
    expect(queryCatalog(products, { price: "sin" })).toHaveLength(65);
  });

  it("filtra por etiquetas con O lógico", () => {
    const tagged = queryCatalog(products, { tags: ["nuevo", "tendencia"] });
    expect(tagged.every((p) => p.tag)).toBe(true);
    expect(queryCatalog(products, { tags: ["nuevo"] }).every((p) => p.tag === "nuevo")).toBe(true);
  });

  it("ordena con valor inicial primero, de menor a mayor", () => {
    const sorted = queryCatalog(products, { sort: "price" });
    expect(sorted.slice(0, 4).map((p) => p.priceFromCop)).toEqual([
      155_000, 155_000, 155_000, 250_000,
    ]);
  });
});

describe("catalogFacets", () => {
  it("cuenta marcas sin incluir 'Marca por confirmar' y limita a 8", () => {
    const facets = catalogFacets(products, undefined);
    expect(facets.brands.length).toBeLessThanOrEqual(8);
    expect(facets.brands.some((b) => b.value === "Marca por confirmar")).toBe(false);
    expect(facets.brands[0]?.value).toBe("Polo Ralph Lauren");
  });

  it("cuenta los rangos de valor dentro de la categoría", () => {
    const facets = catalogFacets(products, "fashion");
    expect(facets.prices.find((p) => p.value === "all")?.count).toBe(21);
    expect(facets.prices.find((p) => p.value === "con")?.count).toBe(4);
  });
});

describe("parseTags", () => {
  it("ignora valores desconocidos", () => {
    expect(parseTags("nuevo,otro,tendencia")).toEqual(["nuevo", "tendencia"]);
    expect(parseTags(null)).toEqual([]);
  });
});

describe("Colección Polo", () => {
  it("tiene 18 prendas: 9 hombre, 8 niños y la gorra", () => {
    const counts = Object.fromEntries(poloLineCounts(products).map((l) => [l.value, l.count]));
    expect(counts).toEqual({ all: 18, hombre: 9, ninos: 8, gorras: 1 });
  });

  it("filtra por talla disponible (no agotada) y color", () => {
    const xs = queryPolo(products, { line: "hombre", size: "XS" }).map((p) => p.id);
    expect(xs).not.toContain("m1"); // XS agotada en origen
    expect(xs).toContain("m2");
    const green = queryPolo(products, { color: "Verde" }).map((p) => p.id);
    expect(green.sort()).toEqual(["k8", "m6", "m7"]);
  });
});
