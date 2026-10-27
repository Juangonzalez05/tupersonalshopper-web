"use client";

import Image from "next/image";
import Link from "next/link";
import { lineVariantText, type CartLine } from "@/domain/cart";
import { formatCOP } from "@/domain/money";
import { cn } from "@/lib/cn";
import { QtyStepper } from "./qty-stepper";
import { useCart } from "./store";

/** Línea del pedido. "compact" = panel lateral; "full" = página Mi pedido. */
export function CartLineItem({
  line,
  variant = "compact",
  onNavigate,
}: {
  line: CartLine;
  variant?: "compact" | "full";
  onNavigate?: () => void;
}) {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const full = variant === "full";
  const variantText = lineVariantText(line);

  return (
    <li
      className={cn(
        "grid items-start gap-4 border-b border-line",
        full
          ? "grid-cols-[84px_minmax(0,1fr)] gap-3.5 py-6 md:grid-cols-[110px_minmax(0,1fr)_140px] md:gap-4"
          : "grid-cols-[72px_minmax(0,1fr)_auto] py-[18px]",
      )}
    >
      <Link href={`/producto/${line.slug}`} onClick={onNavigate} tabIndex={-1} aria-hidden="true">
        <Image
          src={line.image}
          alt=""
          width={full ? 110 : 72}
          height={full ? 138 : 90}
          className={cn(
            "bg-tile object-cover",
            full ? "h-[105px] w-[84px] md:h-[138px] md:w-[110px]" : "h-[90px] w-[72px]",
          )}
        />
      </Link>
      <div className="flex min-w-0 flex-col gap-1">
        <p
          className={cn(
            "m-0 text-muted",
            full ? "text-[11px] tracking-[.12em] uppercase" : "text-xs",
          )}
        >
          {full ? `${line.categoryLabel} · ${line.brand}` : `${line.brand} · ${line.categoryLabel}`}
        </p>
        <p className={cn("m-0 type-serif leading-[1.25]", full ? "text-xl" : "text-[17px]")}>
          <Link
            href={`/producto/${line.slug}`}
            onClick={onNavigate}
            className="no-underline hover:underline hover:decoration-gold hover:underline-offset-4"
          >
            {line.name}
          </Link>
        </p>
        {variantText ? <p className="m-0 text-xs text-muted">{variantText}</p> : null}
        {line.health ? (
          <p className="m-0 text-xs text-gold-ink">Consulta previa de viabilidad de importación</p>
        ) : null}
        <div className="mt-2.5 flex flex-wrap items-center gap-4">
          <QtyStepper
            value={line.qty}
            onChange={(qty) => setQty(line.key, qty)}
            label={line.name}
          />
          <button
            type="button"
            onClick={() => remove(line.key)}
            className="min-h-11 border-0 bg-transparent p-0 text-xs font-semibold tracking-[.12em] text-navy uppercase underline decoration-gold underline-offset-[6px]"
            aria-label={`Quitar ${line.name} del pedido`}
          >
            Quitar
          </button>
        </div>
      </div>
      <div
        className={cn(
          "flex flex-col gap-1 text-[13px] font-semibold whitespace-nowrap",
          full ? "col-start-2 text-left md:col-start-auto md:text-right" : "text-right",
        )}
      >
        {full ? (
          <span className="text-[13px] font-normal text-muted">
            {line.priceFromCop ? `Desde ${formatCOP(line.priceFromCop)} c/u` : "Valor inicial"}
          </span>
        ) : null}
        <span className={full ? "text-base" : undefined}>
          {line.priceFromCop ? formatCOP(line.priceFromCop * line.qty) : "Por confirmar"}
        </span>
      </div>
    </li>
  );
}
