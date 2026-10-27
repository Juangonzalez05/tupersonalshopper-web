/**
 * Dinero en COP: siempre entero, miles con punto ("$1.234.567").
 * Se formatea a mano para que servidor y navegador produzcan exactamente el mismo texto.
 */
export function formatCOP(value: number, { suffix = false }: { suffix?: boolean } = {}): string {
  const rounded = Math.round(value);
  const sign = rounded < 0 ? "-" : "";
  const digits = String(Math.abs(rounded)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sign}$${digits}${suffix ? " COP" : ""}`;
}
