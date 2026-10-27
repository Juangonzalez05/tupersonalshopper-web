import type { Metadata, Viewport } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { site } from "@/config/site";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter, WhatsAppFab } from "@/components/layout/site-footer";
import { JsonLd } from "@/components/seo/json-ld";
import { CartDrawer } from "@/features/cart/cart-drawer";
import { CartHydrator } from "@/features/cart/store";
import "@/styles/globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  axes: ["opsz"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} · Personal shopper de Estados Unidos a Colombia`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "personal shopper",
    "compras en Estados Unidos",
    "envíos a Colombia",
    "Walmart",
    "Amazon",
    "Polo Ralph Lauren",
    "Medicube",
    "Victoria's Secret",
  ],
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0B1431",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-CO" className={`${dmSans.variable} ${dmSerif.variable}`}>
      <body>
        <a
          href="#contenido"
          className="sr-only z-100 bg-gold px-4 py-3 text-sm font-semibold text-navy focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Saltar al contenido
        </a>
        <NuqsAdapter>
          <CartHydrator />
          <SiteHeader />
          <main id="contenido" tabIndex={-1} className="focus:outline-none">
            {children}
          </main>
          <SiteFooter />
          <WhatsAppFab />
          <CartDrawer />
        </NuqsAdapter>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.name,
            url: site.url,
            logo: `${site.url}/brand/logo-mark.png`,
            description: site.description,
            areaServed: "CO",
            ...(site.instagramUser ? { sameAs: [site.instagramUrl] } : {}),
          }}
        />
      </body>
    </html>
  );
}
