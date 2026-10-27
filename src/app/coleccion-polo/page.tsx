import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { catalog, editorial } from "@/data";
import { productPath } from "@/domain/product";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/typography";
import { ProductGrid } from "@/features/catalog/product-grid";
import { CapFeature } from "@/features/polo/cap-feature";
import { Lookbook } from "@/features/polo/lookbook";
import { PoloBrowser } from "@/features/polo/polo-browser";

export const metadata: Metadata = {
  title: "Colección Polo",
  description:
    "Camisetas polo de piqué, rayas, tejidos trenzados para niños y la gorra clásica en 25 colores, compradas en tiendas de Estados Unidos.",
  alternates: { canonical: "/coleccion-polo" },
  openGraph: { images: [{ url: editorial.poloHero.src, alt: editorial.poloHero.alt }] },
};

export default async function PoloPage() {
  const products = (await catalog.listProducts()).filter((p) => p.polo);
  const cap = products.find((p) => p.polo?.line === "gorras");
  const byId = new Map(products.map((p) => [p.id, p]));
  const lookbook = editorial.lookbook.map((item) => ({
    src: item.src,
    alt: item.alt,
    caption: item.caption,
    href: byId.get(item.productId) ? productPath(byId.get(item.productId)!) : "/coleccion-polo",
  }));

  return (
    <>
      <section
        aria-labelledby="polo-t"
        className="grid grid-cols-1 bg-navy text-ivory md:min-h-[640px] md:grid-cols-2"
      >
        <div className="flex flex-col justify-center gap-6 px-5 pt-9 pb-11 md:p-12 lg:p-[72px]">
          <Eyebrow onDark>Colección Polo · Temporada otoño</Eyebrow>
          <h1 id="polo-t" className="type-display text-ivory">
            Clásicos americanos, elegidos para ti en Estados Unidos.
          </h1>
          <p className="type-lead max-w-[44ch] text-on-navy">
            Camisetas polo de piqué, rayas marineras, tejidos trenzados para niños y la gorra de
            siempre en 25 colores.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#prendas" className={buttonVariants({ variant: "gold" })}>
              Ver prendas
            </a>
            <a href="#lookbook" className={buttonVariants({ variant: "lineOnDark" })}>
              Ver lookbook
            </a>
          </div>
          <p className="m-0 max-w-[62ch] border-t border-gold pt-3 text-xs text-on-navy-soft">
            Selección de prendas de la marca Polo Ralph Lauren que Tu Shopper USA compra en tiendas
            de Estados Unidos. Somos un servicio independiente de compras personales: no somos
            tienda oficial ni distribuidor de la marca.
          </p>
        </div>
        <div className="relative min-h-[460px] bg-tile md:min-h-[640px]">
          <Image
            src={editorial.poloHero.src}
            alt={editorial.poloHero.alt}
            fill
            sizes="(min-width: 761px) 50vw, 100vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover object-top"
          />
        </div>
      </section>

      <section className="wrap sec" id="prendas" aria-labelledby="pr-t">
        <Suspense fallback={<ProductGrid products={products} />}>
          <PoloBrowser products={products} />
        </Suspense>
      </section>

      <section className="bg-tile" id="lookbook" aria-labelledby="lb-t">
        <div className="wrap sec">
          <div className="mb-7 flex flex-col items-start gap-3.5 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-2.5">
              <Eyebrow>Lookbook</Eyebrow>
              <h2 id="lb-t" className="type-h2">
                Cómo se lleva la colección
              </h2>
            </div>
            <p className="m-0 max-w-[40ch] type-small text-muted">
              Fotografías de referencia de la tienda de origen. Toca una imagen para ver la prenda.
            </p>
          </div>
          <Lookbook items={lookbook} />
        </div>
      </section>

      {cap ? <CapFeature product={cap} /> : null}
    </>
  );
}
