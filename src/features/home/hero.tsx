import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/domain/product";
import { categoryPath, productPath } from "@/domain/product";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/typography";
import { CheckIcon } from "@/components/icons/icons";
import { cn } from "@/lib/cn";

const trust = ["Sin pagos en línea", "Cotización sin compromiso", "Atención por WhatsApp"];

function Caption({ children }: { children: string }) {
  return (
    <span className="absolute bottom-3 left-3 bg-ivory/95 px-2.5 py-1.5 text-[10px] tracking-[.2em] text-ink uppercase">
      {children}
    </span>
  );
}

export function Hero({
  main,
  face,
  body,
}: {
  main: { src: string; alt: string };
  face: Product;
  body: Product;
}) {
  const smallTiles = [
    { product: face, caption: "Cuidado facial", href: productPath(face) },
    { product: body, caption: "Cuidado personal", href: categoryPath("body") },
  ];
  return (
    <section
      className="wrap grid grid-cols-1 items-center gap-10 pt-9 pb-14 md:pt-[72px] md:pb-[88px] lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16"
      aria-labelledby="hero-t"
    >
      <div className="flex flex-col gap-7">
        <Eyebrow>Personal shopper · Estados Unidos a Colombia</Eyebrow>
        <h1 id="hero-t" className="type-display">
          Lo que te gusta de Estados Unidos, elegido para ti y enviado a Colombia.
        </h1>
        <p className="type-lead max-w-[46ch] text-muted">
          Recorremos Walmart, Amazon y las tiendas que prefieres. Tú armas tu lista; nosotros te
          confirmamos precio final y disponibilidad por WhatsApp antes de comprar.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/catalogo"
            className={cn(buttonVariants({ variant: "gold" }), "flex-1 md:flex-none")}
          >
            Explorar catálogo
          </Link>
          <Link
            href="/como-funciona"
            className={cn(buttonVariants({ variant: "line" }), "flex-1 md:flex-none")}
          >
            Cómo funciona
          </Link>
        </div>
        <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-3 border-t border-line p-0 pt-5 text-[13px] text-muted md:gap-6">
          {trust.map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CheckIcon className="size-4 text-gold-ink" strokeWidth={1.4} />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-2.5 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] md:gap-4">
        <Link
          href="/coleccion-polo"
          className="relative row-span-2 block overflow-hidden bg-tile outline outline-1 outline-offset-[5px] outline-gold md:outline-offset-8"
        >
          <Image
            src={main.src}
            alt={main.alt}
            fill
            sizes="(min-width: 1181px) 33vw, 54vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
          <Caption>Colección Polo</Caption>
        </Link>
        {smallTiles.map(({ product, caption, href }) => (
          <Link
            key={product.id}
            href={href}
            className="relative block aspect-[4/5] overflow-hidden bg-tile"
          >
            {product.images[0] ? (
              <Image
                src={product.images[0].src}
                alt={product.images[0].alt}
                fill
                sizes="(min-width: 1181px) 26vw, 40vw"
                loading="eager"
                className="object-cover"
              />
            ) : null}
            <Caption>{caption}</Caption>
          </Link>
        ))}
      </div>
    </section>
  );
}
