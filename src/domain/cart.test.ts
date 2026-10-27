import { describe, expect, it } from "vitest";
import {
  addLine,
  lineKey,
  pendingNote,
  removeLine,
  setLineQty,
  subtotalLabel,
  summarize,
  type NewCartLine,
} from "./cart";

const cap: NewCartLine = {
  productId: "g1",
  slug: "gorra-polo-clasica-polo-ralph-lauren",
  name: "Gorra Polo clásica",
  brand: "Polo Ralph Lauren",
  categoryLabel: "Colección Polo",
  image: "/img/p/gorra-1.webp",
  priceFromCop: 250_000,
  selections: { Color: "Polo Black" },
  health: false,
};

const serum: NewCartLine = {
  ...cap,
  productId: "f04",
  slug: "serum",
  name: "Sérum PDRN Pink Peptide",
  priceFromCop: null,
  selections: { Presentación: "30 ml" },
};

describe("lineKey", () => {
  it("no depende del orden de las variantes", () => {
    expect(lineKey("m1", { Talla: "M", Color: "Navy" })).toBe(
      lineKey("m1", { Color: "Navy", Talla: "M" }),
    );
  });
});

describe("addLine", () => {
  it("une la misma combinación de producto y variantes", () => {
    const lines = addLine(addLine([], cap, 1), cap, 2);
    expect(lines).toHaveLength(1);
    expect(lines[0]?.qty).toBe(3);
  });

  it("separa variantes distintas del mismo producto", () => {
    const lines = addLine(addLine([], cap), { ...cap, selections: { Color: "Otro" } });
    expect(lines).toHaveLength(2);
  });

  it("limita la cantidad entre 1 y 99", () => {
    expect(addLine([], cap, 500)[0]?.qty).toBe(99);
    expect(addLine([], cap, 0)[0]?.qty).toBe(1);
  });
});

describe("setLineQty / removeLine", () => {
  it("nunca baja de 1 unidad", () => {
    const [line] = addLine([], cap);
    expect(setLineQty([line!], line!.key, 0)[0]?.qty).toBe(1);
  });

  it("quita la línea", () => {
    const [line] = addLine([], cap);
    expect(removeLine([line!], line!.key)).toEqual([]);
  });
});

describe("summarize", () => {
  it("suma solo los productos con valor inicial y cuenta los pendientes", () => {
    const lines = addLine(addLine([], cap, 2), serum, 1);
    expect(summarize(lines)).toEqual({
      products: 2,
      units: 3,
      subtotalCop: 500_000,
      pendingCount: 1,
    });
  });

  it("redacta la nota de pendientes en singular y plural", () => {
    expect(pendingNote(0)).toBe("");
    expect(pendingNote(1)).toBe("1 producto queda con valor por confirmar.");
    expect(pendingNote(3)).toBe("3 productos quedan con valor por confirmar.");
  });
});

describe("subtotalLabel", () => {
  it("muestra 'Por confirmar' si ningún producto trae valor inicial", () => {
    expect(subtotalLabel(summarize(addLine([], serum)))).toBe("Por confirmar");
    expect(subtotalLabel(summarize(addLine([], cap, 2)))).toBe("$500.000 COP");
  });
});
