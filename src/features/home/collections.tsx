import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/typography";
import { cn } from "@/lib/cn";

interface SideTile {
  href: string;
  image: { src: string; alt: string };
  eyebrow: string;
  title: string;
  text: string;
  cta?: string;
  note?: string;
}

export function Collections({
  main,
  side,
}: {
  main: { href: string; image: { src: string; alt: string } };
  side: SideTile[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3.5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] md:grid-rows-[auto_auto] md:gap-6">
      <Link
        href={main.href}
        className="group relative block aspect-[4/5] overflow-hidden bg-tile text-ivory no-underline md:row-span-2"
      >
        <Image
          src={main.image.src}
          alt={main.image.alt}
          fill
          sizes="(min-width: 761px) 55vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-linear-to-t from-navy/85 to-navy/0 p-5 md:p-7">
          <Eyebrow onDark>Moda · Hombre y niños</Eyebrow>
          <h3 className="type-h2 text-ivory">Colección Polo</h3>
          <p className="m-0 max-w-[40ch] text-on-navy-mute">
            Camisetas polo, tejidos trenzados y gorras en 25 colores. Tallas para hombre y niños.
          </p>
          <span className={cn(buttonVariants({ variant: "gold" }), "mt-2 self-start")}>
            Ver colección
          </span>
        </div>
      </Link>
      {side.map((tile) => (
        <Link
          key={tile.href}
          href={tile.href}
          className="group grid aspect-[4/3] grid-cols-2 overflow-hidden border border-line bg-white text-ink no-underline md:aspect-[16/10]"
        >
          <div className="relative bg-tile">
            <Image
              src={tile.image.src}
              alt={tile.image.alt}
              fill
              sizes="(min-width: 761px) 22vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
          <div className="flex flex-col justify-center gap-2.5 p-5 md:p-7">
            <Eyebrow>{tile.eyebrow}</Eyebrow>
            <h3 className="type-h3">{tile.title}</h3>
            <p className="m-0 type-small text-muted">{tile.text}</p>
            {tile.note ? <p className="m-0 type-small text-gold-ink">{tile.note}</p> : null}
            {tile.cta ? (
              <span className="text-[13px] font-semibold tracking-[.1em] uppercase underline decoration-gold underline-offset-[6px]">
                {tile.cta}
              </span>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  );
}
