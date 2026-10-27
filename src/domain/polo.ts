import type { PoloLine, Product } from "./product";

export const POLO_LINES: { value: PoloLine | "all"; label: string }[] = [
  { value: "all", label: "Toda la colección" },
  { value: "hombre", label: "Hombre" },
  { value: "ninos", label: "Niños" },
  { value: "gorras", label: "Gorras" },
];

/** Familias de color del filtro, con su muestra. */
export const POLO_COLOR_FAMILIES: { value: string; swatch: string }[] = [
  { value: "Azul marino", swatch: "#1E2A4A" },
  { value: "Azul claro", swatch: "#AFC2E3" },
  { value: "Blanco y crema", swatch: "#F2EEE3" },
  { value: "Verde", swatch: "#2F5D46" },
  { value: "Beige y gris", swatch: "#B9AE98" },
  { value: "Negro", swatch: "#1A1B1F" },
  {
    value: "Rayas y multicolor",
    swatch: "linear-gradient(90deg,#1E2A4A 0 33%,#B23A3A 33% 66%,#E6C75A 66%)",
  },
];

const ADULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const KID_SIZES = ["2T", "3T", "4", "5", "6", "7", "S", "M", "L", "XL"];

export interface PoloQuery {
  line?: PoloLine;
  size?: string;
  color?: string;
}

export function sizesFor(product: Product): string[] {
  const group = product.variants.find((g) => g.name === "Talla");
  return group ? group.options.filter((o) => !o.soldOut).map((o) => o.value) : [];
}

export function inLine(products: Product[], line: PoloLine | undefined): Product[] {
  return products.filter((p) => p.polo && (!line || p.polo.line === line));
}

export function queryPolo(products: Product[], query: PoloQuery): Product[] {
  return inLine(products, query.line).filter(
    (p) =>
      (!query.size || sizesFor(p).includes(query.size)) &&
      (!query.color || p.polo?.colorFamily === query.color),
  );
}

export function poloSizeOptions(line: PoloLine | undefined): string[] {
  if (line === "gorras") return [];
  return line === "ninos" ? KID_SIZES : ADULT_SIZES;
}

export function poloColorOptions(products: Product[], line: PoloLine | undefined) {
  const scoped = inLine(products, line);
  return POLO_COLOR_FAMILIES.filter((family) =>
    scoped.some((p) => p.polo?.colorFamily === family.value),
  );
}

export function poloLineCounts(products: Product[]) {
  return POLO_LINES.map((line) => ({
    ...line,
    count: inLine(products, line.value === "all" ? undefined : line.value).length,
  }));
}
