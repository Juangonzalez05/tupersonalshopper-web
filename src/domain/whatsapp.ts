import { lineVariantText, subtotalLabel, summarize, type CartLine } from "./cart";
import { formatCOP } from "./money";
import type { CustomOrderItem, CustomerData } from "./schemas";

/**
 * Enlace "click to chat". Sin número configurado, WhatsApp abre el mensaje y deja elegir
 * el contacto, así el flujo funciona aunque el número aún esté por confirmar.
 */
export function whatsappUrl(phone: string | undefined, text?: string): string {
  const base = phone ? `https://wa.me/${phone}` : "https://wa.me/";
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

function customerBlock(customer: Omit<CustomerData, "consent">): string[] {
  return [
    "*Mis datos*",
    `Nombre: ${customer.name}`,
    customer.city ? `Ciudad: ${customer.city}` : "",
    `WhatsApp: ${customer.whatsapp}`,
    customer.comments ? `Comentarios: ${customer.comments}` : "",
  ].filter(Boolean);
}

export function quoteMessage(
  lines: CartLine[],
  customer: Omit<CustomerData, "consent">,
  siteUrl: string,
): string {
  const summary = summarize(lines);
  const items = lines.map((line, index) => {
    const variant = lineVariantText(line);
    const price = line.priceFromCop
      ? `valor inicial desde ${formatCOP(line.priceFromCop)} c/u`
      : "valor por confirmar";
    return [
      `${index + 1}. ${line.name} (${line.brand})`,
      variant ? `   ${variant}` : "",
      `   Cantidad: ${line.qty} · ${price}`,
      `   ${siteUrl}/producto/${line.slug}`,
    ]
      .filter(Boolean)
      .join("\n");
  });

  const totals = [
    `Productos: ${summary.products} · Unidades: ${summary.units}`,
    `Subtotal referencial: ${subtotalLabel(summary)}`,
    summary.pendingCount ? `Con valor por confirmar: ${summary.pendingCount}` : "",
  ].filter(Boolean);

  return [
    "Hola, Tu Shopper USA. Quiero cotizar esta lista:",
    "",
    ...items,
    "",
    ...totals,
    "",
    ...customerBlock(customer),
  ].join("\n");
}

export function customOrderMessage(
  items: CustomOrderItem[],
  customer: Omit<CustomerData, "consent">,
): string {
  const products = items.map((item, index) =>
    [
      `${index + 1}. ${item.name || "Producto del enlace"}`,
      item.link ? `   Enlace: ${item.link}` : "",
      item.features ? `   Características: ${item.features}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  );
  return [
    "Hola, Tu Shopper USA. Quiero hacer un encargo personalizado:",
    "",
    ...products,
    "",
    ...customerBlock(customer),
  ].join("\n");
}

export function productQuestionMessage(name: string, brand: string, url: string): string {
  return `Hola, Tu Shopper USA. Quiero preguntar por este producto: ${name} (${brand}).\n${url}`;
}
