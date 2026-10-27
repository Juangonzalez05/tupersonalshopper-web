"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav, navKeyForPath } from "@/config/site";
import { cn } from "@/lib/cn";

const linkClass =
  "flex h-11 items-center border-b border-transparent px-[9px] text-xs whitespace-nowrap tracking-[.08em] text-on-navy-link no-underline hover:text-ivory lg:px-3.5 lg:text-[13px]";

/** Menú principal de escritorio con el ítem activo según la ruta. */
export function NavLinks() {
  const active = navKeyForPath(usePathname());
  return <NavList activeKey={active} />;
}

/** Versión sin ruta (respaldo mientras la ruta no se conoce en el prerender). */
export function NavList({ activeKey }: { activeKey?: string }) {
  return (
    <>
      {mainNav.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          aria-current={item.key === activeKey ? "page" : undefined}
          className={cn(linkClass, item.key === activeKey && "border-gold text-ivory")}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
