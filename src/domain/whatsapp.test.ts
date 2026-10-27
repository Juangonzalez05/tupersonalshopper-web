import { describe, expect, it } from "vitest";
import { addLine, type NewCartLine } from "./cart";
import { customerSchema, customOrderSchema, fieldErrors } from "./schemas";
import { customOrderMessage, formatPhoneLabel, quoteMessage, whatsappUrl } from "./whatsapp";

const line: NewCartLine = {
  productId: "g1",
  slug: "gorra-polo-clasica-polo-ralph-lauren",
  name: "Gorra Polo clásica",
  brand: "Polo Ralph Lauren",
  categoryLabel: "Colección Polo",
  image: "/img/p/g.webp",
  priceFromCop: 250_000,
  selections: { Color: "Polo Black" },
  health: false,
};

const customer = {
  name: "Laura Gómez",
  city: "Medellín",
  whatsapp: "+57 300 000 0000",
  comments: "",
};

describe("formatPhoneLabel", () => {
  it("agrupa los celulares colombianos", () => {
    expect(formatPhoneLabel("573239105182")).toBe("+57 323 910 5182");
  });

  it("deja otros números con el indicativo y sin formato", () => {
    expect(formatPhoneLabel("14155550123")).toBe("+14155550123");
  });
});

describe("whatsappUrl", () => {
  it("codifica el texto y usa el número configurado", () => {
    expect(whatsappUrl("573001234567", "Hola & más")).toBe(
      "https://wa.me/573001234567?text=Hola%20%26%20m%C3%A1s",
    );
  });

  it("sin número deja elegir el contacto", () => {
    expect(whatsappUrl(undefined, "Hola")).toBe("https://wa.me/?text=Hola");
    expect(whatsappUrl(undefined)).toBe("https://wa.me/");
  });
});

describe("quoteMessage", () => {
  it("incluye productos, variantes, cantidades, subtotal y datos del cliente", () => {
    const lines = addLine([], line, 2);
    const text = quoteMessage(lines, customer, "https://tushopperusa.com");
    expect(text).toContain("1. Gorra Polo clásica (Polo Ralph Lauren)");
    expect(text).toContain("Color: Polo Black");
    expect(text).toContain("Cantidad: 2 · valor inicial desde $250.000 c/u");
    expect(text).toContain(
      "https://tushopperusa.com/producto/gorra-polo-clasica-polo-ralph-lauren",
    );
    expect(text).toContain("Subtotal referencial: $500.000 COP");
    expect(text).toContain("Nombre: Laura Gómez");
    expect(text).toContain("Ciudad: Medellín");
    expect(text).not.toContain("Comentarios:");
  });
});

describe("customOrderMessage", () => {
  it("lista cada producto del encargo", () => {
    const text = customOrderMessage(
      [
        {
          name: "Freidora de aire",
          link: "https://www.walmart.com/ip/123",
          features: "5 L, negra",
        },
      ],
      customer,
    );
    expect(text).toContain("1. Freidora de aire");
    expect(text).toContain("Enlace: https://www.walmart.com/ip/123");
    expect(text).toContain("Características: 5 L, negra");
  });
});

describe("schemas", () => {
  it("pide nombre, WhatsApp y autorización con mensajes en español", () => {
    const result = customerSchema.safeParse({ name: "", whatsapp: "", consent: false });
    expect(result.success).toBe(false);
    const errors = fieldErrors(result.error!);
    expect(errors.name).toBe("Escribe tu nombre para saber cómo llamarte.");
    expect(errors.whatsapp).toBe("Necesitamos tu WhatsApp para enviarte la cotización.");
    expect(errors.consent).toBeDefined();
  });

  it("acepta un número con espacios y signo +", () => {
    const result = customerSchema.safeParse({ ...customer, consent: true });
    expect(result.success).toBe(true);
  });

  it("en un encargo exige nombre o enlace por producto y un enlace válido", () => {
    const empty = customOrderSchema.safeParse({
      ...customer,
      consent: true,
      items: [{ name: "", link: "", features: "" }],
    });
    expect(fieldErrors(empty.error!)["items.0.name"]).toBe(
      "Escribe el nombre del producto o pega su enlace.",
    );
    const badLink = customOrderSchema.safeParse({
      ...customer,
      consent: true,
      items: [{ name: "", link: "walmart", features: "" }],
    });
    expect(fieldErrors(badLink.error!)["items.0.link"]).toBe(
      "Pega el enlace completo, empezando por https://",
    );
  });
});
