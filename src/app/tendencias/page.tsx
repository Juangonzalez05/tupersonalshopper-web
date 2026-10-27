import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { catalog, curation } from "@/data";
import { formatCOP } from "@/domain/money";
import { isHealthProduct, productLabel, productPath, type Product } from "@/domain/product";
import { buttonVariants } from "@/components/ui/button";
import { chipVariants } from "@/components/ui/chip";
import { Photo } from "@/components/ui/photo";
import { HealthNote } from "@/components/ui/status";
import { Tag } from "@/components/ui/tag";
import { Eyebrow, SectionHead, SectionLink } from "@/components/ui/typography";
import { QuickAddButton } from "@/features/cart/quick-add-button";
import { ProductCard } from "@/features/catalog/product-card";
import { ProductGrid, gridClass } from "@/features/catalog/product-grid";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Tendencias",
  description:
    "Lo más pedido, lo viral en Estados Unidos, las novedades de la semana e ideas para Black Friday y Navidad.",
  alternates: { canonical: "/tendencias" },
};

const sections = [
  { href: "#pedido", label: "Lo más pedido" },
  { href: "#viral", label: "Viral en USA" },
  { href: "#novedades", label: "Novedades de la semana" },
  { href: "#temporada", label: "Black Friday y Navidad" },
];

function Mosaic({ products, dark }: { products: Product[]; dark?: boolean }) {
  return (
    <div
      className={cn("grid grid-cols-3 content-center gap-2 p-4", dark ? "bg-navy-2" : "bg-tile")}
    >
      {products.map((product) =>
        product.images[0] ? (
          <Link key={product.id} href={productPath(product)} aria-label={product.name}>
            <Photo src={product.images[0].src} alt="" sizes="(min-width: 761px) 10vw, 30vw" />
          </Link>
        ) : null,
      )}
    </div>
  );
}

export default async function TrendsPage() {
  const ids = curation.trends;
  const [ranking, viral, news, gifts, blackFriday, christmas] = await Promise.all([
    catalog.getProductsByIds(ids.ranking),
    catalog.getProductsByIds(ids.viral),
    catalog.getProductsByIds(ids.news),
    catalog.getProductsByIds(ids.gifts),
    catalog.getProductsByIds(ids.blackFriday),
    catalog.getProductsByIds(ids.christmas),
  ]);

  return (
    <>
      <header className="wrap flex flex-col gap-7 border-b border-line pt-14 pb-12 md:pt-[72px] md:pb-14">
        <Eyebrow>Tendencias · {ids.weekLabel}</Eyebrow>
        <h1 className="type-display max-w-[18ch]">
          Lo más pedido, lo viral en USA y lo que acaba de llegar.
        </h1>
        <nav aria-label="Secciones de Tendencias" className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <a key={section.href} href={section.href} className={chipVariants()}>
              {section.label}
            </a>
          ))}
        </nav>
      </header>

      <section className="wrap sec" id="pedido" aria-labelledby="mp-t">
        <SectionHead
          eyebrow="Ranking de la semana"
          title="Lo más pedido"
          titleId="mp-t"
          action={
            <p className="m-0 max-w-[36ch] type-small text-muted">
              Selección de ejemplo; se actualiza con los pedidos reales de la semana.
            </p>
          }
        />
        <ol className="m-0 grid list-none grid-cols-2 gap-x-3.5 gap-y-7 p-0 md:grid-cols-3 md:gap-6 lg:grid-cols-5">
          {ranking.map((product, index) => (
            <li key={product.id} className="flex flex-col gap-3">
              <span
                className="type-serif text-[40px] leading-none text-gold md:text-[56px]"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <Link
                href={productPath(product)}
                className="block"
                aria-label={`Puesto ${index + 1}: ${product.name}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-tile">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0].src}
                      alt={product.images[0].alt}
                      fill
                      sizes="(min-width: 1181px) 240px, (min-width: 761px) 30vw, 46vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>
              </Link>
              <p className="m-0 text-[11px] tracking-[.16em] text-muted uppercase">
                {productLabel(product)} · {product.brand}
              </p>
              <h3 className="m-0 type-serif text-base leading-[1.22] md:text-[19px]">
                <Link
                  href={productPath(product)}
                  className="no-underline hover:underline hover:decoration-gold"
                >
                  {product.name}
                </Link>
              </h3>
              <p className="m-0 type-small text-muted">
                {product.priceFromCop
                  ? `Valor inicial desde ${formatCOP(product.priceFromCop, { suffix: true })}`
                  : "Valor por confirmar"}
              </p>
              {isHealthProduct(product) ? <HealthNote /> : null}
              <div className="mt-auto">
                <QuickAddButton product={product} />
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-navy text-ivory" id="viral" aria-labelledby="vi-t">
        <div className="wrap sec">
          <SectionHead
            eyebrow="Viral en USA"
            title="Lo que se está viendo en redes en Estados Unidos"
            titleId="vi-t"
            onDark
            action={
              <SectionLink href="/catalogo" onDark>
                Ver catálogo
              </SectionLink>
            }
          />
          <ul className={cn(gridClass, "m-0 list-none p-0")}>
            {viral.map((product) => (
              <li key={product.id} className="min-w-0 bg-ivory p-3 pb-4 text-ink md:p-4 md:pb-5">
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap sec" id="novedades" aria-labelledby="no-t">
        <SectionHead
          eyebrow="Recién publicados"
          title="Novedades de la semana"
          titleId="no-t"
          action={<SectionLink href="/catalogo?destacado=nuevo">Ver todo lo nuevo</SectionLink>}
        />
        <ProductGrid products={news} />
      </section>

      <section className="bg-mist" id="temporada" aria-labelledby="te-t">
        <div className="wrap sec">
          <SectionHead
            eyebrow="Colecciones de temporada"
            title="Black Friday y Navidad se acercan"
            titleId="te-t"
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <article className="grid grid-cols-1 bg-navy text-ivory md:min-h-[420px] md:grid-cols-2">
              <div className="flex flex-col justify-between gap-4 px-[22px] py-7 md:p-10">
                <div className="flex flex-col gap-3.5">
                  <Tag variant="gold" className="self-start">
                    Noviembre
                  </Tag>
                  <h3 className="type-h2 text-ivory">Black Friday: arma tu lista con tiempo</h3>
                  <p className="m-0 text-on-navy">
                    Las tiendas de Estados Unidos publican sus valores de temporada a finales de
                    noviembre. Envíanos tu lista desde ya y te confirmamos cada precio en cuanto la
                    tienda lo publique.
                  </p>
                </div>
                <Link
                  href="/catalogo"
                  className={cn(buttonVariants({ variant: "gold" }), "self-start")}
                >
                  Armar mi lista
                </Link>
              </div>
              <Mosaic products={blackFriday} dark />
            </article>
            <article className="grid grid-cols-1 border border-line bg-white md:min-h-[420px] md:grid-cols-2">
              <div className="flex flex-col justify-between gap-4 px-[22px] py-7 md:p-10">
                <div className="flex flex-col gap-3.5">
                  <Tag variant="tendencia" className="self-start">
                    Diciembre
                  </Tag>
                  <h3 className="type-h2">Regalos de Navidad que llegan a tiempo</h3>
                  <p className="m-0 text-muted">
                    Sets de labios, cremas en estuche, perfumes y kits de maquillaje. Pide antes de
                    [fecha límite por confirmar] para recibir en diciembre.
                  </p>
                </div>
                <a
                  href="#regalos"
                  className={cn(buttonVariants({ variant: "navy" }), "self-start")}
                >
                  Ver ideas de regalo
                </a>
              </div>
              <Mosaic products={christmas} />
            </article>
          </div>

          <div id="regalos" className="pt-[72px]">
            <SectionHead eyebrow="Ideas de regalo" title="Para regalar esta Navidad" as="h3" />
            <ProductGrid products={gifts} />
          </div>
        </div>
      </section>
    </>
  );
}
