/**
 * Modelo del catálogo. TypeScript puro: no importa React, Next ni la fuente de datos.
 */

export const CATEGORY_KEYS = [
  "beauty",
  "face",
  "body",
  "health",
  "fashion",
  "home",
  "snack",
] as const;
export type CategoryKey = (typeof CATEGORY_KEYS)[number];

export interface Category {
  key: CategoryKey;
  slug: string;
  label: string;
  /** Rótulo corto para tarjetas ("Belleza", "Cuidado facial"…). */
  shortLabel: string;
  description: string;
}

/** Taxonomía fija del catálogo: nombre, rótulo corto y slug de URL de cada categoría. */
export const CATEGORY_INFO: Record<CategoryKey, Pick<Category, "slug" | "label" | "shortLabel">> = {
  beauty: { slug: "belleza-y-maquillaje", label: "Belleza y maquillaje", shortLabel: "Belleza" },
  face: { slug: "cuidado-facial", label: "Cuidado facial", shortLabel: "Cuidado facial" },
  body: { slug: "cuidado-personal", label: "Cuidado personal", shortLabel: "Cuidado personal" },
  health: {
    slug: "salud-y-bienestar",
    label: "Salud y bienestar",
    shortLabel: "Salud y bienestar",
  },
  fashion: { slug: "moda-y-accesorios", label: "Moda y accesorios", shortLabel: "Moda" },
  home: { slug: "hogar", label: "Hogar", shortLabel: "Hogar" },
  snack: {
    slug: "snacks-y-ediciones-especiales",
    label: "Snacks y ediciones especiales",
    shortLabel: "Snacks",
  },
};

export type ProductTag = "nuevo" | "tendencia";

export const TAG_LABELS: Record<ProductTag, string> = {
  nuevo: "Nuevo",
  tendencia: "Tendencia",
};

/** "confirmar" = disponibilidad por confirmar con la tienda de origen (el caso normal). */
export type Availability = "disponible" | "confirmar" | "agotado";

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  disponible: "Disponible",
  confirmar: "Disponibilidad por confirmar",
  agotado: "Agotado en la tienda de origen",
};

export interface VariantOption {
  value: string;
  /** Agotada en la tienda de origen (talla tachada en la captura). */
  soldOut?: boolean;
  /** Color CSS para mostrar como círculo. */
  swatch?: string;
}

export interface VariantGroup {
  /** "Talla", "Color", "Aroma", "Presentación"… */
  name: string;
  display: "chips" | "swatches" | "select";
  options: VariantOption[];
  /** Aclaración visible bajo el selector. */
  note?: string;
}

export interface ProductImage {
  src: string;
  alt: string;
  /** Si la foto corresponde a una opción concreta (p. ej. un aroma). */
  variant?: string;
}

export type PoloLine = "hombre" | "ninos" | "gorras";

export interface PoloInfo {
  line: PoloLine;
  /** Familia de color para el filtro de la colección. */
  colorFamily: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategoryKey;
  subcategory: string;
  /** Valor inicial de referencia en COP (entero). null = "Valor por confirmar". */
  priceFromCop: number | null;
  tag?: ProductTag;
  availability: Availability;
  availabilityNote?: string;
  variants: VariantGroup[];
  images: ProductImage[];
  description?: string;
  polo?: PoloInfo;
  /** Posición en el orden "Recomendados". */
  rank: number;
}

export const UNKNOWN_BRAND = "Marca por confirmar";

export type Selections = Record<string, string>;

export function isHealthProduct(product: Pick<Product, "category">): boolean {
  return product.category === "health";
}

/** Rótulo de la tarjeta: "Colección Polo", "Ropa interior" o la categoría corta. */
export function productLabel(product: Pick<Product, "category" | "subcategory" | "polo">): string {
  if (product.polo) return "Colección Polo";
  if (product.category === "fashion") return product.subcategory;
  return CATEGORY_INFO[product.category].shortLabel;
}

export function productPath(product: Pick<Product, "slug">): string {
  return `/producto/${product.slug}`;
}

export function categoryPath(category: CategoryKey): string {
  return `/catalogo/${CATEGORY_INFO[category].slug}`;
}

/** Primer grupo de variantes: el que se elige desde la tarjeta. */
export function primaryVariant(product: Product): VariantGroup | undefined {
  return product.variants[0];
}

/** Opciones disponibles (no agotadas) de un grupo. */
export function availableOptions(group: VariantGroup): VariantOption[] {
  return group.options.filter((option) => !option.soldOut);
}

/**
 * Selección inicial. El grupo principal (el que se elige desde la tarjeta) queda vacío para
 * obligar a elegir, salvo que tenga una sola opción o sea un color (su primera opción es la que
 * tiene nombre confirmado). Los grupos secundarios arrancan en su primera opción disponible y
 * se cambian en el detalle del producto.
 */
export function defaultSelections(product: Product): Selections {
  const selections: Selections = {};
  product.variants.forEach((group, index) => {
    const [first, ...rest] = availableOptions(group);
    if (!first) return;
    const preselect =
      index > 0 || rest.length === 0 || group.display === "swatches" || group.name === "Color";
    if (preselect) selections[group.name] = first.value;
  });
  return selections;
}

/** Grupos que todavía no tienen opción elegida. */
export function missingSelections(product: Product, selections: Selections): VariantGroup[] {
  return product.variants.filter((group) => !selections[group.name]);
}

/** "Talla: M · Color: Refined Navy" */
export function describeSelections(selections: Selections): string {
  return Object.entries(selections)
    .map(([name, value]) => `${name}: ${value}`)
    .join(" · ");
}

/** Imagen principal para una selección (si hay foto de esa variante). */
export function imageIndexForSelections(product: Product, selections: Selections): number {
  const values = new Set(Object.values(selections));
  const index = product.images.findIndex((image) => image.variant && values.has(image.variant));
  return index >= 0 ? index : 0;
}
