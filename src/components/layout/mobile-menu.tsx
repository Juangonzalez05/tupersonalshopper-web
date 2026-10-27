"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { mainNav, site } from "@/config/site";
import { whatsappUrl } from "@/domain/whatsapp";
import { buttonVariants } from "@/components/ui/button";
import { ChevronRightIcon, CloseIcon, MenuIcon } from "@/components/icons/icons";
import { useCartCount } from "@/features/cart/store";

/**
 * Menú desplegable de móvil, debajo del header. Se cierra con Escape, al elegir un enlace
 * o al tocar fuera.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const count = useCartCount();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !buttonRef.current?.contains(target))
        setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex size-11 items-center justify-center rounded-sm border-0 bg-transparent text-inherit nav:hidden"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <CloseIcon className="size-[22px]" /> : <MenuIcon className="size-[22px]" />}
      </button>
      <nav
        ref={panelRef}
        id={panelId}
        hidden={!open}
        aria-label="Menú móvil"
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-100px)] overflow-auto border-b border-gold bg-navy px-5 pt-2 pb-6 text-ivory nav:hidden"
      >
        {[...mainNav, { key: "pedido", label: `Mi pedido (${count})`, href: "/mi-pedido" }].map(
          (item) => (
            <Link
              key={item.key}
              href={item.href}
              onClick={close}
              className="flex min-h-[52px] items-center justify-between border-b border-navy-line type-serif text-[22px] no-underline"
            >
              {item.label}
              <ChevronRightIcon className="size-[18px] text-gold" />
            </Link>
          ),
        )}
        <div className="flex flex-col gap-2.5 pt-6">
          <a
            href={whatsappUrl(site.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "gold", block: true })}
          >
            Escríbenos por WhatsApp
          </a>
          <p className="m-0 type-small text-on-navy-soft">
            Atención personalizada · {site.schedule}
          </p>
        </div>
      </nav>
    </>
  );
}
