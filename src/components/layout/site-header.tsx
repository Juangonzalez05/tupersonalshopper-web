import Link from "next/link";
import { Suspense } from "react";
import { site } from "@/config/site";
import { SearchIcon } from "@/components/icons/icons";
import { CartButton } from "@/features/cart/cart-button";
import { PromoMarquee } from "@/features/marquee/promo-marquee";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { NavLinks, NavList } from "./nav-links";

export function SiteHeader() {
  return (
    <>
      {/* Lo primero de la página, antes de la barra de anuncio y del menú. No es fija. */}
      <PromoMarquee />
      <div className="sticky top-0 z-60">
        <p className="m-0 border-b border-navy-line bg-navy px-3 py-[7px] text-center text-[11px] tracking-[.06em] text-on-navy md:px-4 md:py-2 md:text-xs">
          {/* En celular solo la frase final: "Compramos por ti…" ya lo dice el título del hero. */}
          <span className="hidden md:inline">
            {site.announcement.text} <b className="font-semibold text-gold">·</b>{" "}
          </span>
          {site.announcement.highlight}
        </p>
        <header className="relative border-b border-gold/45 bg-navy text-ivory">
          <div className="wrap flex h-16 items-center gap-2 md:h-[84px] md:gap-8">
            <MobileMenu />
            <Logo className="mx-auto md:mr-auto md:ml-0 nav:mr-0" />
            <nav aria-label="Principal" className="mx-auto hidden items-center gap-1 nav:flex">
              {/* La ruta activa se resuelve en el navegador; mientras tanto, menú sin marcar. */}
              <Suspense fallback={<NavList />}>
                <NavLinks />
              </Suspense>
            </nav>
            <div className="flex flex-none items-center gap-1.5">
              <Link
                href="/catalogo#buscar"
                aria-label="Buscar en el catálogo"
                className="hidden size-11 items-center justify-center rounded-sm text-inherit md:inline-flex"
              >
                <SearchIcon className="size-[22px]" />
              </Link>
              <div className="hidden md:block">
                <CartButton />
              </div>
              <div className="md:hidden">
                <CartButton compact />
              </div>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}
