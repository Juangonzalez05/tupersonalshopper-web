import { z } from "zod";

/** Datos oficiales de contacto: se usan cuando la variable de entorno no está definida. */
export const DEFAULT_WHATSAPP_NUMBER = "573239105182";
export const DEFAULT_INSTAGRAM_USER = "tushopperusa.co";

/**
 * Limpia lo que alguien pega en el panel de Vercel (espacios, "+", "@") y trata una variable
 * vacía como "no definida" para que aplique el valor por defecto.
 */
const clean = (normalize: (value: string) => string) => (value: unknown) => {
  if (typeof value !== "string") return value;
  const cleaned = normalize(value.trim());
  return cleaned === "" ? undefined : cleaned;
};

/**
 * Variables públicas validadas al iniciar. Next.js reemplaza `process.env.NEXT_PUBLIC_*`
 * en tiempo de build, por eso se leen una por una (no con `process.env` completo).
 */
const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.preprocess(
    clean((value) => value),
    z
      .url()
      .default("http://localhost:3000")
      .transform((url) => url.replace(/\/+$/, "")),
  ),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.preprocess(
    clean((value) => value.replace(/[\s+().-]/g, "")),
    z
      .string()
      .regex(/^\d{8,15}$/, "Solo dígitos, con indicativo de país (p. ej. 573001234567)")
      .default(DEFAULT_WHATSAPP_NUMBER),
  ),
  NEXT_PUBLIC_INSTAGRAM_USER: z.preprocess(
    clean((value) => value.replace(/^@/, "")),
    z
      .string()
      .regex(/^[A-Za-z0-9._]{1,30}$/, "Usuario de Instagram sin @")
      .default(DEFAULT_INSTAGRAM_USER),
  ),
});

// Vercel expone el dominio de producción como variable del sistema; sirve mientras no
// se configure NEXT_PUBLIC_SITE_URL con el dominio propio.
const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
  : undefined;

export type RawEnv = Partial<
  Record<
    "NEXT_PUBLIC_SITE_URL" | "NEXT_PUBLIC_WHATSAPP_NUMBER" | "NEXT_PUBLIC_INSTAGRAM_USER",
    string | undefined
  >
>;

/** Valida y normaliza las variables públicas. Se exporta aparte para poder probarla. */
export function parseEnv(raw: RawEnv) {
  return schema.parse(raw);
}

export const env = parseEnv({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || vercelUrl,
  NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  NEXT_PUBLIC_INSTAGRAM_USER: process.env.NEXT_PUBLIC_INSTAGRAM_USER,
});
