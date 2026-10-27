import { Suspense } from "react";
import { catalog } from "@/data";
import { inCategory } from "@/domain/catalog-query";
import type { Category } from "@/domain/product";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Eyebrow } from "@/components/ui/typography";
import { CatalogBrowser, CatalogFallback } from "./catalog-browser";

/** Página de catálogo, completa o de una categoría. */
export async function CatalogPage({ category }: { category?: Category }) {
  const products = await catalog.listProducts();
  return (
    <div className="wrap pb-24">
      <Breadcrumbs
        items={
          category
            ? [{ label: "Catálogo", href: "/catalogo" }, { label: category.label }]
            : [{ label: "Catálogo" }]
        }
      />
      <header className="flex flex-col gap-3 pt-5 pb-8">
        <Eyebrow>Catálogo Tu Shopper USA</Eyebrow>
        <h1 className="type-h1">{category ? category.label : "Todo el catálogo"}</h1>
        <p className="type-lead max-w-[62ch] text-muted">
          {category
            ? `${category.description} Agrégalos a tu pedido y te confirmamos precio final y disponibilidad por WhatsApp.`
            : "Productos que compramos con frecuencia en tiendas de Estados Unidos. Agrégalos a tu pedido y te confirmamos precio final y disponibilidad por WhatsApp."}
        </p>
      </header>
      <Suspense fallback={<CatalogFallback products={inCategory(products, category?.key)} />}>
        <CatalogBrowser products={products} category={category?.key} />
      </Suspense>
    </div>
  );
}
