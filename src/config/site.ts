import { formatPhoneLabel } from "@/domain/whatsapp";
import { env } from "./env";

/**
 * Datos de la marca y de contacto. Todo lo marcado "[… por confirmar]" está listado
 * en docs/PENDIENTES.md y se reemplaza aquí cuando la dueña lo confirme.
 */
export const site = {
  name: "Tu Shopper USA",
  tagline: "Personal shopper",
  description:
    "Tu personal shopper en Estados Unidos. Elegimos, compramos y enviamos a Colombia lo que pides en Walmart, Amazon y otras tiendas, con precio final confirmado por WhatsApp.",
  url: env.NEXT_PUBLIC_SITE_URL,
  locale: "es_CO",
  country: "CO",
  whatsappNumber: env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  whatsappLabel: formatPhoneLabel(env.NEXT_PUBLIC_WHATSAPP_NUMBER),
  instagramUser: env.NEXT_PUBLIC_INSTAGRAM_USER,
  instagramUrl: `https://instagram.com/${env.NEXT_PUBLIC_INSTAGRAM_USER}`,
  instagramLabel: `@${env.NEXT_PUBLIC_INSTAGRAM_USER}`,
  schedule: "[horario por confirmar]",
  copyrightYear: 2026,
  announcement: {
    text: "Compramos por ti en tiendas de Estados Unidos y lo enviamos a Colombia",
    highlight: "Cotiza sin compromiso por WhatsApp",
  },
  legal:
    "Tu Shopper USA es un servicio independiente de compras personales. No somos tienda oficial ni distribuidores de las marcas mostradas; las marcas y fotografías pertenecen a sus respectivos dueños. Los valores mostrados son referenciales.",
} as const;

export type NavKey = "inicio" | "catalogo" | "polo" | "tendencias" | "encargos" | "ayuda";

export const mainNav: { key: NavKey; label: string; href: string }[] = [
  { key: "inicio", label: "Inicio", href: "/" },
  { key: "catalogo", label: "Catálogo", href: "/catalogo" },
  { key: "polo", label: "Colección Polo", href: "/coleccion-polo" },
  { key: "tendencias", label: "Tendencias", href: "/tendencias" },
  { key: "encargos", label: "Encargos", href: "/encargos" },
  { key: "ayuda", label: "Cómo funciona", href: "/como-funciona" },
];

/** Qué ítem del menú se marca como activo para cada ruta. */
export function navKeyForPath(pathname: string): NavKey | undefined {
  if (pathname === "/") return "inicio";
  if (pathname.startsWith("/coleccion-polo")) return "polo";
  if (pathname.startsWith("/catalogo") || pathname.startsWith("/producto")) return "catalogo";
  if (pathname.startsWith("/tendencias")) return "tendencias";
  if (pathname.startsWith("/encargos")) return "encargos";
  if (pathname.startsWith("/como-funciona")) return "ayuda";
  return undefined;
}
