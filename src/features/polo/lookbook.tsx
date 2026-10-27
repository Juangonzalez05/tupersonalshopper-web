import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

export interface LookbookItem {
  src: string;
  alt: string;
  caption: string;
  href: string;
}

// Composición editorial de 12 columnas: 7/5, 4/4/4, 5/7 (en móvil, 2 columnas).
const spans = [
  "col-span-2 md:col-span-7",
  "col-span-2 md:col-span-5",
  "col-span-1 md:col-span-4",
  "col-span-1 md:col-span-4",
  "col-span-2 md:col-span-4",
  "col-span-2 md:col-span-5",
  "col-span-2 md:col-span-7",
];
const sizes = ["58vw", "42vw", "33vw", "33vw", "33vw", "42vw", "58vw"];

export function Lookbook({ items }: { items: LookbookItem[] }) {
  return (
    <ul className="m-0 grid list-none grid-cols-2 gap-3.5 p-0 md:grid-cols-12 md:gap-6">
      {items.map((item, index) => (
        <li key={item.src} className={cn(spans[index % spans.length])}>
          <Link href={item.href} className="group flex flex-col no-underline">
            <span className="relative block aspect-[4/5] overflow-hidden bg-tile">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes={`(min-width: 761px) ${sizes[index % sizes.length]}, 100vw`}
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </span>
            <span className="flex items-baseline justify-between gap-3 pt-3 text-xs tracking-[.14em] text-muted uppercase">
              <span>{item.caption}</span>
              <span className="group-hover:text-ink group-hover:underline group-hover:decoration-gold">
                Ver prenda
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
