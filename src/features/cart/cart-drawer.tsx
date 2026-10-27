"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { pendingNote, summarize, subtotalLabel } from "@/domain/cart";
import { buttonVariants } from "@/components/ui/button";
import { CloseIcon } from "@/components/icons/icons";
import { CartLineItem } from "./cart-line-item";
import { useCart, useCartHydrated } from "./store";

/** Panel lateral "Mi pedido": se abre desde el header y desde los botones de agregar. */
export function CartDrawer() {
  const open = useCart((s) => s.drawerOpen);
  const setOpen = useCart((s) => s.setDrawerOpen);
  const lines = useCart((s) => s.lines);
  const ready = useCartHydrated();
  const summary = summarize(lines);
  const close = () => setOpen(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-80 bg-navy/55" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-90 flex w-full flex-col bg-ivory text-ink focus:outline-none md:w-[440px] md:border-l md:border-gold"
          aria-describedby="drawer-note"
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <div>
              <p className="type-eyebrow mb-1 text-gold-ink">Lista de cotización</p>
              <Dialog.Title className="type-h3 text-navy">
                Mi pedido · {summary.products} {summary.products === 1 ? "producto" : "productos"}
              </Dialog.Title>
            </div>
            <Dialog.Close
              className="inline-flex size-11 items-center justify-center rounded-sm border-0 bg-transparent text-navy"
              aria-label="Cerrar mi pedido"
            >
              <CloseIcon className="size-[22px]" />
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-auto px-6 py-2">
            {ready && lines.length > 0 ? (
              <ul className="m-0 list-none p-0">
                {lines.map((line) => (
                  <CartLineItem key={line.key} line={line} onNavigate={close} />
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-start gap-4 py-10">
                <p className="type-h3 m-0">Tu pedido está vacío</p>
                <p className="m-0 text-[15px] text-muted">
                  Agrega productos del catálogo y te confirmamos precio final y disponibilidad por
                  WhatsApp.
                </p>
                <Link
                  href="/catalogo"
                  onClick={close}
                  className={buttonVariants({ variant: "gold" })}
                >
                  Explorar catálogo
                </Link>
              </div>
            )}
          </div>

          {ready && lines.length > 0 ? (
            <div className="flex flex-col gap-3 border-t border-line bg-white px-6 pt-5 pb-6">
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span>Subtotal referencial</span>
                <b className="type-serif text-2xl">{subtotalLabel(summary)}</b>
              </div>
              <p id="drawer-note" className="m-0 type-small text-muted">
                {summary.pendingCount
                  ? `Incluye solo los productos con valor inicial; ${pendingNote(summary.pendingCount).toLowerCase()} `
                  : ""}
                El precio final, la disponibilidad y el envío te los confirmamos por WhatsApp.
              </p>
              <Link
                href="/mi-pedido#cotizar"
                onClick={close}
                className={buttonVariants({ variant: "gold", block: true })}
              >
                Solicitar cotización
              </Link>
              <Link
                href="/mi-pedido"
                onClick={close}
                className={buttonVariants({ variant: "line", block: true })}
              >
                Ver mi pedido completo
              </Link>
            </div>
          ) : (
            <p id="drawer-note" className="sr-only">
              Tu lista de cotización está vacía.
            </p>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
