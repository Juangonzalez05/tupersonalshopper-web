import Link from "next/link";
import type { CategoryKey } from "@/domain/product";
import { CategoryIcon } from "@/components/icons/icons";

export interface CategoryTile {
  icon: CategoryKey | "polo";
  label: string;
  href: string;
  countLabel: string;
}

export function CategoryGrid({ tiles }: { tiles: CategoryTile[] }) {
  return (
    <ul className="m-0 grid list-none grid-cols-2 border-t border-l border-line p-0 md:grid-cols-4 lg:grid-cols-8">
      {tiles.map((tile) => (
        <li key={tile.href} className="border-r border-b border-line">
          <Link
            href={tile.href}
            className="flex h-full min-h-[132px] flex-col gap-3.5 px-4 py-[18px] no-underline transition-colors hover:bg-white md:min-h-[150px] md:px-[18px] md:py-6"
          >
            <CategoryIcon category={tile.icon} className="size-[30px] text-gold-ink" />
            <b className="type-serif text-lg leading-[1.2] font-normal">{tile.label}</b>
            <small className="mt-auto text-xs text-muted">{tile.countLabel}</small>
          </Link>
        </li>
      ))}
    </ul>
  );
}
