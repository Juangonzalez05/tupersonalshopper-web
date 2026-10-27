import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { catalog } from "@/data";
import {
  CATEGORY_INFO,
  UNKNOWN_BRAND,
  categoryPath,
  isHealthProduct,
  productPath,
  type Product,
} from "@/domain/product";
import { Breadcrumbs, type Crumb } from "@/components/layout/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { SectionHead, SectionLink } from "@/components/ui/typography";
import { ProductGrid } from "@/features/catalog/product-grid";
import { ProductView } from "@/features/product/product-view";

/**
 * Los 69 productos se generan en el build. Se permite que la navegación espere (instant = false)
 * para leer `params` antes de responder: así un slug inexistente devuelve un 404 real y no un
 * 200 con la página de error.
 */
export const instant = false;

export async function generateStaticParams() {
  const products = await catalog.listProducts();
  return products.map((product) => ({ slug: product.slug }));
}

function describe(product: Product): string {
  if (product.description) return product.description;
  const brand = product.brand === UNKNOWN_BRAND ? "" : ` de ${product.brand}`;
  if (isHealthProduct(product)) {
    return `${product.name}${brand}, de farmacias de Estados Unidos. Presentación y contenido te los confirmamos al cotizar, junto con la viabilidad de importación a Colombia.`;
  }
  return `${product.name}${brand}, comprado en tiendas de Estados Unidos. Presentación, contenido y detalles te los confirmamos al cotizar, directamente desde la ficha de la tienda.`;
}

export async function generateMetadata({
  params,
}: PageProps<"/producto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await catalog.getProductBySlug(slug);
  if (!product) return {};
  const image = product.images[0];
  return {
    title: `${product.name} · ${product.brand}`,
    description: `${describe(product)} Cotiza por WhatsApp con Tu Shopper USA.`,
    alternates: { canonical: productPath(product) },
    openGraph: {
      type: "website",
      title: `${product.name} · ${product.brand}`,
      images: image ? [{ url: image.src, width: 1200, height: 1500, alt: image.alt }] : undefined,
    },
  };
}

function crumbsFor(product: Product): Crumb[] {
  const category = {
    label: CATEGORY_INFO[product.category].label,
    href: categoryPath(product.category),
  };
  return product.polo
    ? [category, { label: "Colección Polo", href: "/coleccion-polo" }, { label: product.name }]
    : [category, { label: product.name }];
}

export default async function ProductPage({ params }: PageProps<"/producto/[slug]">) {
  const { slug } = await params;
  const product = await catalog.getProductBySlug(slug);
  if (!product) notFound();
  const related = await catalog.getRelatedProducts(product, 4);

  const details = (
    <Accordion>
      <AccordionItem title="Descripción" defaultOpen>
        {describe(product)}
      </AccordionItem>
      <AccordionItem title="Cómo funciona la cotización">
        Agregas el producto con sus opciones, envías tu solicitud y una shopper te escribe por
        WhatsApp con el precio final, la disponibilidad real y los tiempos. Solo compramos cuando tú
        confirmas.
      </AccordionItem>
      <AccordionItem title="Envío a Colombia">
        Coordinamos el envío desde Estados Unidos hasta tu ciudad. Tiempos y costos: [por confirmar
        con Tu Shopper USA].
      </AccordionItem>
    </Accordion>
  );

  return (
    <div className="wrap pb-24">
      <Breadcrumbs items={crumbsFor(product)} />
      <ProductView product={product} details={details} />

      {related.length ? (
        <section className="pt-16 md:pt-24" aria-labelledby="rel-t">
          <SectionHead
            eyebrow={product.polo ? "Completa el look" : "También te puede interesar"}
            title="Productos relacionados"
            titleId="rel-t"
            action={
              product.polo ? (
                <SectionLink href="/coleccion-polo">Ver Colección Polo</SectionLink>
              ) : (
                <SectionLink href={categoryPath(product.category)}>
                  Ver {CATEGORY_INFO[product.category].label.toLowerCase()}
                </SectionLink>
              )
            }
          />
          <ProductGrid products={related} />
        </section>
      ) : null}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: describe(product),
          image: product.images.map((image) => `${site.url}${image.src}`),
          category: CATEGORY_INFO[product.category].label,
          url: `${site.url}${productPath(product)}`,
          ...(product.brand !== UNKNOWN_BRAND
            ? { brand: { "@type": "Brand", name: product.brand } }
            : {}),
        }}
      />
    </div>
  );
}
