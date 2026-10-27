import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { catalog, curation } from "@/data";
import { TAG_LABELS } from "@/domain/product";
import { StarIcon } from "@/components/icons/icons";
import { Tag } from "@/components/ui/tag";
import { cn } from "@/lib/cn";
import { buildMarqueeItems, type MarqueeItem } from "./marquee-items";

/**
 * Cinta de novedades: lo primero de la página, antes de la barra de anuncio y del menú, en todas
 * las páginas. No es fija: se va con el scroll (lo que queda fijo es la barra de anuncio + el menú).
 *
 * - Cada ítem va en dos niveles: etiqueta + marca arriba, nombre del producto en serif abajo, con
 *   la foto 4:5 enmarcada en dorado; entre ítems, la estrella del logo.
 * - La lista se repite dos veces para el bucle continuo. La copia queda oculta para lectores de
 *   pantalla, y los enlaces fuera del orden de tabulación: la cinta va antes del menú y no debe
 *   sumar paradas de Tab (los productos se alcanzan por Catálogo y Tendencias).
 * - La velocidad depende del número de ítems (`--marquee-count`), así no cambia al agregar o quitar.
 * - Se pausa con el cursor o el toque; con "reducir movimiento" pasa a scroll horizontal.
 */
export async function PromoMarquee() {
  const items = buildMarqueeItems(await catalog.listProducts(), curation.marquee);
  return (
    <section
      aria-label="Novedades y tendencias"
      style={{ "--marquee-count": items.length } as CSSProperties}
      className="group relative border-b border-gold/45 bg-navy-2 text-ivory [--marquee-item-seconds:6s] md:[--marquee-item-seconds:8s]"
    >
      <div className="overflow-hidden motion-reduce:overflow-x-auto">
        <ul className="m-0 flex w-max animate-marquee list-none p-0 group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused]">
          {items.map((item, index) => (
            <MarqueeEntry key={`${item.id}-${index}`} item={item} />
          ))}
          {items.map((item, index) => (
            <MarqueeEntry key={`${item.id}-${index}-copia`} item={item} copy />
          ))}
        </ul>
      </div>
      <Fade side="left" />
      <Fade side="right" />
    </section>
  );
}

function MarqueeEntry({ item, copy }: { item: MarqueeItem; copy?: boolean }) {
  return (
    <li aria-hidden={copy || undefined} className="flex items-center">
      <Link
        href={item.href}
        tabIndex={-1}
        className="group/mq flex items-center gap-3 py-1.5 no-underline md:gap-4 md:py-[9px]"
      >
        <span className="relative block h-[55px] w-11 flex-none bg-tile outline outline-1 outline-offset-2 outline-gold/60 md:h-[70px] md:w-14 md:outline-offset-[3px]">
          <Image
            src={item.image}
            alt=""
            fill
            sizes="56px"
            className="object-cover transition-transform duration-500 group-hover/mq:scale-105"
          />
        </span>
        <span className="flex flex-col gap-1.5 md:gap-2">
          <span className="flex items-center gap-2.5">
            <Tag
              variant={item.tag === "nuevo" ? "gold" : "goldLine"}
              className="h-[18px] px-2 text-[9px] md:h-5 md:px-2.5 md:text-[10px]"
            >
              {TAG_LABELS[item.tag]}
            </Tag>
            {item.brand ? (
              <span className="hidden text-[11px] tracking-[.14em] text-on-navy-soft uppercase md:inline">
                {item.brand}
              </span>
            ) : null}
          </span>
          <span className="type-serif text-[15px] leading-[1.15] whitespace-nowrap group-hover/mq:underline group-hover/mq:decoration-gold group-hover/mq:underline-offset-4 md:text-[21px]">
            {item.title}
          </span>
        </span>
      </Link>
      <StarIcon className="mx-5 size-2.5 flex-none text-gold md:mx-8 md:size-3" />
    </li>
  );
}

/** Desvanecido de los bordes: los ítems entran y salen sin cortarse de golpe. */
function Fade({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-y-0 w-12 from-navy-2 to-transparent md:w-24",
        side === "left" ? "left-0 bg-linear-to-r" : "right-0 bg-linear-to-l",
      )}
    />
  );
}
