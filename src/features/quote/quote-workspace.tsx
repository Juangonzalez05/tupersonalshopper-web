"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { site } from "@/config/site";
import { pendingNote, summarize, subtotalLabel } from "@/domain/cart";
import { fieldErrors, quoteSchema } from "@/domain/schemas";
import { quoteMessage, whatsappUrl } from "@/domain/whatsapp";
import { Button, buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/typography";
import { WhatsAppIcon } from "@/components/icons/icons";
import { CartLineItem } from "@/features/cart/cart-line-item";
import { useCart, useCartHydrated } from "@/features/cart/store";
import {
  CustomerFields,
  emptyCustomer,
  focusFirstError,
  type CustomerValues,
} from "./customer-fields";

const FIELD_ORDER = ["name", "city", "whatsapp", "comments", "consent"];

/** Lista de cotización + formulario. Al enviar, abre WhatsApp con la lista ya escrita. */
export function QuoteWorkspace() {
  const ready = useCartHydrated();
  if (!ready) {
    return (
      <div
        className="grid grid-cols-1 items-start gap-9 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-14"
        aria-busy="true"
      >
        <div className="h-80 skeleton" />
        <div className="h-[560px] skeleton" />
      </div>
    );
  }
  return <QuoteForm />;
}

function QuoteForm() {
  const router = useRouter();
  const lines = useCart((s) => s.lines);
  const lastCustomer = useCart((s) => s.lastQuote?.customer);
  const completeQuote = useCart((s) => s.completeQuote);
  // Se recuerdan los datos de la última solicitud para no volver a escribirlos.
  const [values, setValues] = useState<CustomerValues>(() => ({
    ...emptyCustomer,
    ...(lastCustomer
      ? { name: lastCustomer.name, city: lastCustomer.city, whatsapp: lastCustomer.whatsapp }
      : {}),
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const summary = summarize(lines);

  const onChange = (patch: Partial<CustomerValues>) => {
    setValues((current) => ({ ...current, ...patch }));
    setErrors((current) => {
      const next = { ...current };
      for (const key of Object.keys(patch)) delete next[key];
      return next;
    });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = quoteSchema.safeParse(values);
    if (!result.success) {
      const found = fieldErrors(result.error);
      setErrors(found);
      focusFirstError("cot", found, FIELD_ORDER);
      return;
    }
    const { consent, ...customer } = result.data;
    const url = whatsappUrl(site.whatsappNumber, quoteMessage(lines, customer, site.url));
    // Se abre dentro del mismo evento de envío para que el navegador no lo bloquee.
    window.open(url, "_blank", "noopener,noreferrer");
    completeQuote({ lines, customer, whatsappUrl: url, sentAt: new Date().toISOString() });
    router.push("/mi-pedido/enviado");
  };

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 border border-line bg-white p-8 text-center">
        <h2 className="type-h3">Tu pedido está vacío</h2>
        <p className="m-0 max-w-[46ch] type-small text-muted">
          Agrega productos del catálogo o pídenos algo que no esté publicado con un encargo.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link href="/catalogo" className={buttonVariants({ variant: "gold" })}>
            Explorar catálogo
          </Link>
          <Link href="/encargos" className={buttonVariants({ variant: "line" })}>
            Hacer un encargo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 items-start gap-9 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-14">
      <section aria-labelledby="lst-t">
        <div className="flex items-baseline justify-between gap-4 border-b border-navy pb-3.5">
          <h2 id="lst-t" className="type-h3">
            {summary.products} {summary.products === 1 ? "producto" : "productos"} · {summary.units}{" "}
            {summary.units === 1 ? "unidad" : "unidades"}
          </h2>
          <Link
            href="/catalogo"
            className="type-small whitespace-nowrap underline decoration-gold underline-offset-4"
          >
            Seguir agregando
          </Link>
        </div>
        <ul className="m-0 list-none p-0">
          {lines.map((line) => (
            <CartLineItem key={line.key} line={line} variant="full" />
          ))}
        </ul>
        <div className="flex items-baseline justify-between gap-4 pt-6 pb-2 text-sm">
          <span>
            Subtotal referencial{" "}
            <span className="type-small text-muted">(solo productos con valor inicial)</span>
          </span>
          <b className="type-serif text-2xl whitespace-nowrap">{subtotalLabel(summary)}</b>
        </div>
        <p className="m-0 type-small text-muted">
          {pendingNote(summary.pendingCount)} El subtotal no incluye envío, impuestos ni cambios de
          precio en la tienda. El valor final te lo confirmamos por WhatsApp.
        </p>
      </section>

      <section
        id="cotizar"
        aria-labelledby="frm-t"
        className="border border-line bg-white p-[22px] md:p-8"
      >
        <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
          <div className="flex flex-col gap-1.5">
            <Eyebrow>Paso final</Eyebrow>
            <h2 id="frm-t" className="type-h3">
              Tus datos para cotizar
            </h2>
          </div>
          <CustomerFields
            idPrefix="cot"
            values={values}
            errors={errors}
            onChange={onChange}
            commentsPlaceholder="Tallas, colores alternativos, fecha en la que lo necesitas…"
          />
          <Button type="submit" variant="gold" size="lg" block>
            <WhatsAppIcon />
            Solicitar cotización
          </Button>
          <p className="m-0 text-center type-small text-muted">
            Se abrirá WhatsApp con tu lista lista para enviar. Sin pagos en línea.
          </p>
        </form>
      </section>
    </div>
  );
}
