import type { Metadata } from "next";
import { CatalogPage } from "@/features/catalog/catalog-page";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Belleza, cuidado facial y personal, salud, moda y más productos que compramos en tiendas de Estados Unidos. Arma tu lista y cotiza por WhatsApp.",
  alternates: { canonical: "/catalogo" },
};

export default function Page() {
  return <CatalogPage />;
}
