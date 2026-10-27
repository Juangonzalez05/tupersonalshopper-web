import Image from "next/image";
import Link from "next/link";

export interface MarqueeItem {
  label: string;
  title: string;
  href: string;
  image: string;
}

/**
 * Cinta de novedades. La lista se repite dos veces para el bucle continuo; la copia queda
 * oculta para lectores de pantalla y fuera del orden de tabulación. Se pausa con el cursor o
 * el foco y se convierte en scroll horizontal si el usuario pide reducir el movimiento.
 */
export function Marquee({ items, ariaLabel }: { items: MarqueeItem[]; ariaLabel: string }) {
  const renderItem = (item: MarqueeItem, copy: boolean, index: number) => (
    <li key={`${copy ? "b" : "a"}-${index}`} aria-hidden={copy || undefined}>
      <Link
        href={item.href}
        tabIndex={copy ? -1 : undefined}
        className="group/mq flex min-h-14 items-center gap-3 border-r border-navy-line px-5 py-2.5 text-[11px] tracking-[.2em] whitespace-nowrap text-ivory uppercase no-underline md:min-h-16 md:gap-3.5 md:px-7 md:py-3"
      >
        <Image
          src={item.image}
          alt=""
          width={40}
          height={50}
          className="h-[50px] w-10 bg-tile object-cover"
        />
        <span className="font-bold text-gold">{item.label}</span>
        <span aria-hidden="true">·</span>
        <span className="group-hover/mq:underline group-hover/mq:decoration-gold group-hover/mq:underline-offset-[5px]">
          {item.title}
        </span>
      </Link>
    </li>
  );

  return (
    <section
      aria-label={ariaLabel}
      className="group relative overflow-hidden border-y border-gold bg-navy text-ivory motion-reduce:overflow-x-auto"
    >
      <ul className="m-0 flex w-max animate-marquee list-none p-0 group-focus-within:[animation-play-state:paused] group-hover:[animation-play-state:paused] group-active:[animation-play-state:paused]">
        {items.map((item, index) => renderItem(item, false, index))}
        {items.map((item, index) => renderItem(item, true, index))}
      </ul>
    </section>
  );
}
