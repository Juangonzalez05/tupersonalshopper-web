import { z } from "zod";

/**
 * Variables públicas validadas al iniciar. Next.js reemplaza `process.env.NEXT_PUBLIC_*`
 * en tiempo de build, por eso se leen una por una (no con `process.env` completo).
 */
const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z
    .url()
    .default("http://localhost:3000")
    .transform((url) => url.replace(/\/+$/, "")),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z
    .string()
    .regex(/^\d{8,15}$/, "Solo dígitos, con indicativo de país (p. ej. 573001234567)")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  NEXT_PUBLIC_INSTAGRAM_USER: z
    .string()
    .regex(/^[A-Za-z0-9._]{1,30}$/, "Usuario de Instagram sin @")
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

// Vercel expone el dominio de producción como variable del sistema; sirve mientras no
// se configure NEXT_PUBLIC_SITE_URL con el dominio propio.
const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

export const env = schema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || vercelUrl,
  NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  NEXT_PUBLIC_INSTAGRAM_USER: process.env.NEXT_PUBLIC_INSTAGRAM_USER,
});
