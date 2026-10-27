import { z } from "zod";

const phoneDigits = (value: string) => value.replace(/\D/g, "");

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Escribe tu nombre para saber cómo llamarte.")
    .max(80, "El nombre es demasiado largo."),
  city: z.string().trim().max(60, "Escribe solo la ciudad.").default(""),
  whatsapp: z
    .string()
    .trim()
    .min(1, "Necesitamos tu WhatsApp para enviarte la cotización.")
    .refine(
      (value) => phoneDigits(value).length >= 7 && phoneDigits(value).length <= 15,
      "Revisa el número: escribe tu WhatsApp con indicativo, p. ej. +57 300 000 0000.",
    ),
  comments: z.string().trim().max(600, "Máximo 600 caracteres.").default(""),
  consent: z.literal(true, {
    error: "Necesitamos tu autorización para contactarte por WhatsApp.",
  }),
});

export type CustomerData = z.output<typeof customerSchema>;

export const quoteSchema = customerSchema;
export type QuoteData = CustomerData;

export const MAX_CUSTOM_ITEMS = 5;

export const customOrderItemSchema = z
  .object({
    name: z.string().trim().max(120, "Máximo 120 caracteres.").default(""),
    link: z
      .string()
      .trim()
      .max(500, "El enlace es demasiado largo.")
      .refine((value) => value === "" || /^https?:\/\/\S+\.\S+/i.test(value), {
        message: "Pega el enlace completo, empezando por https://",
      })
      .default(""),
    features: z.string().trim().max(200, "Máximo 200 caracteres.").default(""),
  })
  .refine((item) => item.name !== "" || item.link !== "", {
    message: "Escribe el nombre del producto o pega su enlace.",
    path: ["name"],
  });

export type CustomOrderItem = z.output<typeof customOrderItemSchema>;

export const customOrderSchema = customerSchema.extend({
  items: z.array(customOrderItemSchema).min(1).max(MAX_CUSTOM_ITEMS),
});

export type CustomOrderData = z.output<typeof customOrderSchema>;

/** Convierte los errores de zod en { "campo": "mensaje" } (primer error de cada campo). */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!(key in errors)) errors[key] = issue.message;
  }
  return errors;
}
