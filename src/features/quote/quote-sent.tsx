"use client";

import Link from "next/link";
import { lineVariantText, summarize, subtotalLabel } from "@/domain/cart";
import { formatCOP } from "@/domain/money";
import { Steps } from "@/components/layout/steps";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/typography";
import { CheckIcon, WhatsAppIcon } from "@/components/icons/icons";
import { useCart, useCartHydrated } from "@/features/cart/store";

const nextSteps = [
  { text: "Revisamos cada producto en la tienda de origen." },
  { text: "Te escribimos con precio final, disponibilidad y tiempos." },
  { text: "Solo compramos cuando confirmas por WhatsApp." },
];

/**
 * Confirmación. El sitio no tiene servidor de pedidos: la solicitud llega cuando la persona
 * envía el mensaje en WhatsApp, por eso el texto lo pide explícitamente y deja el botón a mano.
 */
export function QuoteSent() {
  const ready = useCartHydrated();
  const quote = useCart((s) => s.lastQuote);

  if (!ready) return <div className="mx-auto my-24 h-96 max-w-[760px] skeleton" aria-busy="true" />;

  if (!quote) {
    return (
      <section className="mx-auto flex max-w-[760px] flex-col items-center gap-6 py-14 text-center md:py-24">
        <h1 className="type-h1">No hay una solicitud reciente</h1>
        <p className="type-lead text-muted">
          Arma tu lista en el catálogo y solicita tu cotización.
        </p>
        <Link href="/catalogo" className={buttonVariants({ variant: "gold" })}>
          Explorar catálogo
        </Link>
      </section>
    );
  }

  const summary = summarize(quote.lines);
  return (
    <section
      aria-labelledby="ok-t"
      className="mx-auto flex max-w-[760px] flex-col items-center gap-6 py-14 text-center md:py-24"
    >
      <span className="flex size-[88px] items-center justify-center rounded-full border border-gold text-gold-ink">
        <CheckIcon className="size-9" strokeWidth={1.3} />
      </span>
      <Eyebrow>Solicitud lista</Eyebrow>
      <h1 id="ok-t" className="type-h1 md:text-5xl">
        Envía tu lista por WhatsApp
      </h1>
      <p className="type-lead max-w-[52ch] text-muted">
        Abrimos WhatsApp con tu lista ya escrita. Cuando envíes el mensaje, te confirmamos precio
        final y disponibilidad al {quote.customer.whatsapp}. Aún no has hecho ningún pago.
      </p>
      <a
        href={quote.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: "gold", size: "lg" })}
      >
        <WhatsAppIcon />
        Abrir WhatsApp con mi lista
      </a>

      <div className="flex w-full flex-col gap-1 border border-line bg-white p-[22px] text-left md:p-8">
        <div className="flex flex-wrap justify-between gap-4 border-b border-line pb-3">
          <b className="type-serif text-xl font-normal">Resumen de tu solicitud</b>
          <span className="type-small text-muted">
            {summary.products} {summary.products === 1 ? "producto" : "productos"}
          </span>
        </div>
        <ul className="m-0 list-none p-0">
          {quote.lines.map((line) => (
            <li
              key={line.key}
              className="flex justify-between gap-4 border-b border-line py-2.5 text-sm"
            >
              <span>
                {line.qty} × {line.name}
                {lineVariantText(line) ? (
                  <span className="type-small text-muted"> · {lineVariantText(line)}</span>
                ) : null}
              </span>
              <span className="font-semibold whitespace-nowrap">
                {line.priceFromCop ? formatCOP(line.priceFromCop * line.qty) : "Por confirmar"}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex items-baseline justify-between gap-4 pt-3 text-sm">
          <span>Subtotal referencial</span>
          <b className="type-serif text-2xl">{subtotalLabel(summary)}</b>
        </div>
      </div>

      <Steps steps={nextSteps} compact className="w-full text-left" />

      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/catalogo" className={buttonVariants({ variant: "navy" })}>
          Seguir explorando
        </Link>
        <Link href="/encargos" className={buttonVariants({ variant: "line" })}>
          Hacer un encargo
        </Link>
      </div>
    </section>
  );
}
