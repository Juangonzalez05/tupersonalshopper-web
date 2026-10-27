import { UNKNOWN_BRAND, type CategoryKey, type Product, type ProductTag } from "./product";
import { normalizeText } from "./text";

export const PRICE_FILTERS = ["con", "lt200", "200300", "sin"] as const;
export type PriceFilter = (typeof PRICE_FILTERS)[number];

export const PRICE_FILTER_LABELS: Record<PriceFilter | "all", string> = {
  all: "Todos",
  con: "Con valor inicial",
  lt200: "Hasta $200.000",
  "200300": "$200.000 – $300.000",
  sin: "Valor por confirmar",
};

export const SORT_KEYS = ["rec", "new", "trend", "price", "az"] as const;
export type SortKey = (typeof SORT_KEYS)[number];

export const SORT_LABELS: Record<SortKey, string> = {
  rec: "Recomendados",
  new: "Nuevos primero",
  trend: "Tendencia primero",
  price: "Con valor inicial primero",
  az: "Nombre A–Z",
};

export interface CatalogQuery {
  category?: CategoryKey;
  sub?: string;
  brand?: string;
  tags?: ProductTag[];
  price?: PriceFilter;
  q?: string;
  sort?: SortKey;
}

export const PAGE_SIZE = 12;

export function matchesPrice(product: Product, filter: PriceFilter | undefined): boolean {
  const price = product.priceFromCop ?? 0;
  switch (filter) {
    case undefined:
      return true;
    case "con":
      return price > 0;
    case "lt200":
      return price > 0 && price <= 200_000;
    case "200300":
      return price > 200_000 && price <= 300_000;
    case "sin":
      return price === 0;
  }
}

function matchesSearch(product: Product, q: string | undefined): boolean {
  const needle = normalizeText(q ?? "");
  if (!needle) return true;
  const haystack = normalizeText(`${product.name} ${product.brand} ${product.subcategory}`);
  return needle.split(/\s+/).every((word) => haystack.includes(word));
}

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  rec: (a, b) => a.rank - b.rank,
  new: (a, b) => Number(b.tag === "nuevo") - Number(a.tag === "nuevo") || a.rank - b.rank,
  trend: (a, b) => Number(b.tag === "tendencia") - Number(a.tag === "tendencia") || a.rank - b.rank,
  price: (a, b) =>
    Number((b.priceFromCop ?? 0) > 0) - Number((a.priceFromCop ?? 0) > 0) ||
    (a.priceFromCop ?? 0) - (b.priceFromCop ?? 0) ||
    a.rank - b.rank,
  az: (a, b) => a.name.localeCompare(b.name, "es"),
};

export function inCategory(products: Product[], category: CategoryKey | undefined): Product[] {
  return category ? products.filter((p) => p.category === category) : products;
}

/** Aplica todos los filtros y el orden. */
export function queryCatalog(products: Product[], query: CatalogQuery): Product[] {
  const tags = query.tags ?? [];
  return inCategory(products, query.category)
    .filter(
      (p) =>
        (!query.sub || p.subcategory === query.sub) &&
        (!query.brand || p.brand === query.brand) &&
        (tags.length === 0 || (p.tag !== undefined && tags.includes(p.tag))) &&
        matchesPrice(p, query.price) &&
        matchesSearch(p, query.q),
    )
    .sort(sorters[query.sort ?? "rec"]);
}

export interface FacetOption<T extends string = string> {
  value: T;
  label: string;
  count: number;
}

export interface CatalogFacets {
  subcategories: FacetOption[];
  brands: FacetOption[];
  prices: FacetOption<PriceFilter | "all">[];
}

/**
 * Opciones de los filtros con su conteo dentro de la categoría actual
 * (igual que en el diseño: los conteos no dependen de los otros filtros).
 */
export function catalogFacets(
  products: Product[],
  category: CategoryKey | undefined,
): CatalogFacets {
  const scoped = inCategory(products, category);

  const subCounts = new Map<string, number>();
  const brandCounts = new Map<string, number>();
  for (const p of scoped) {
    subCounts.set(p.subcategory, (subCounts.get(p.subcategory) ?? 0) + 1);
    if (p.brand !== UNKNOWN_BRAND) brandCounts.set(p.brand, (brandCounts.get(p.brand) ?? 0) + 1);
  }

  const toOptions = (counts: Map<string, number>) =>
    [...counts].map(([value, count]) => ({ value, label: value, count }));

  return {
    subcategories: toOptions(subCounts),
    brands: toOptions(brandCounts)
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "es"))
      .slice(0, 8),
    prices: (["all", ...PRICE_FILTERS] as const).map((value) => ({
      value,
      label: PRICE_FILTER_LABELS[value],
      count: scoped.filter((p) => matchesPrice(p, value === "all" ? undefined : value)).length,
    })),
  };
}

/** Lectura tolerante de parámetros de URL (valores desconocidos se ignoran). */
export function parseTags(value: string | null | undefined): ProductTag[] {
  return (value ?? "")
    .split(",")
    .filter((tag): tag is ProductTag => tag === "nuevo" || tag === "tendencia");
}
