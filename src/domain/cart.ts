import { formatCOP } from "./money";
import { describeSelections, type Selections } from "./product";

/**
 * "Mi pedido" es una lista de cotización, no un carrito de compra: no hay pago en el sitio.
 * Cada línea guarda una copia de los datos del producto al momento de agregarlo, para que la
 * lista no dependa de la fuente del catálogo.
 */
export interface CartLine {
  key: string;
  productId: string;
  slug: string;
  name: string;
  brand: string;
  categoryLabel: string;
  image: string;
  priceFromCop: number | null;
  selections: Selections;
  qty: number;
  health: boolean;
}

export type NewCartLine = Omit<CartLine, "key" | "qty">;

export const MAX_QTY = 99;

export function lineKey(productId: string, selections: Selections): string {
  const parts = Object.keys(selections)
    .sort()
    .map((name) => `${name}=${selections[name]}`);
  return [productId, ...parts].join("|");
}

function clampQty(qty: number): number {
  if (!Number.isFinite(qty)) return 1;
  return Math.min(MAX_QTY, Math.max(1, Math.round(qty)));
}

/** Agrega una línea; si ya existe la misma combinación producto + variantes, suma cantidades. */
export function addLine(lines: CartLine[], line: NewCartLine, qty = 1): CartLine[] {
  const key = lineKey(line.productId, line.selections);
  const existing = lines.find((item) => item.key === key);
  if (existing) {
    return lines.map((item) =>
      item.key === key ? { ...item, qty: clampQty(item.qty + qty) } : item,
    );
  }
  return [...lines, { ...line, key, qty: clampQty(qty) }];
}

export function setLineQty(lines: CartLine[], key: string, qty: number): CartLine[] {
  return lines.map((item) => (item.key === key ? { ...item, qty: clampQty(qty) } : item));
}

export function removeLine(lines: CartLine[], key: string): CartLine[] {
  return lines.filter((item) => item.key !== key);
}

export interface CartSummary {
  /** Productos distintos (líneas). */
  products: number;
  units: number;
  /** Suma solo de los productos con valor inicial. */
  subtotalCop: number;
  /** Líneas con "Valor por confirmar". */
  pendingCount: number;
}

export function summarize(lines: CartLine[]): CartSummary {
  return lines.reduce<CartSummary>(
    (acc, line) => ({
      products: acc.products + 1,
      units: acc.units + line.qty,
      subtotalCop: acc.subtotalCop + (line.priceFromCop ?? 0) * line.qty,
      pendingCount: acc.pendingCount + (line.priceFromCop ? 0 : 1),
    }),
    { products: 0, units: 0, subtotalCop: 0, pendingCount: 0 },
  );
}

/** "$310.000 COP", o "Por confirmar" si ningún producto trae valor inicial. */
export function subtotalLabel(summary: CartSummary): string {
  return summary.subtotalCop > 0
    ? formatCOP(summary.subtotalCop, { suffix: true })
    : "Por confirmar";
}

export function lineVariantText(line: Pick<CartLine, "selections">): string {
  return describeSelections(line.selections);
}

export function pendingNote(pendingCount: number): string {
  if (pendingCount === 0) return "";
  return pendingCount === 1
    ? "1 producto queda con valor por confirmar."
    : `${pendingCount} productos quedan con valor por confirmar.`;
}
