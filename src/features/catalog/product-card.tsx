"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { formatCOP } from "@/domain/money";
import {
  defaultSelections,
  isHealthProduct,
  primaryVariant,
  productLabel,
  productPath,
  type Product,
} from "@/domain/product";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/field";
import { AvailabilityStatus, HealthNote } from "@/components/ui/status";
import { ProductTagBadge } from "@/components/ui/tag";
import { BagIcon, CategoryIcon, CheckIcon } from "@/components/icons/icons";
import { useAddToCart } from "@/features/cart/use-add-to-cart";
import { cn } from "@/lib/cn";

/** Ancho de la tarjeta en las grillas de 4 / 3 / 2 columnas. */
export const CARD_SIZES = "(min-width: 1181px) 300px, (min-width: 761px) 30vw, 46vw";

export function ProductCard({
  product,
  eager,
  className,
}: {
  product: Product;
  eager?: boolean;
  className?: string;
}) {
  const [selections, setSelections] = useState(() => defaultSelections(product));
  const [error, setError] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);
  const selectId = useId();
  const { add, inCart, openDrawer } = useAddToCart(product, selections);

  const href = productPath(product);
  const group = primaryVariant(product);
  const showSelect = group && group.options.length > 1;
  const soldOut = product.availability === "agotado";
  const image = product.images[0];

  const onAdd = () => {
    if (group && !selections[group.name]) {
      setError(true);
      selectRef.current?.focus();
      return;
    }
    add();
  };

  return (
    <article className={cn("group/card flex h-full flex-col", className)}>
      <Link
        href={href}
        className="relative block aspect-[4/5] overflow-hidden bg-tile no-underline"
        aria-label={`Ver detalle de ${product.name}`}
      >
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={CARD_SIZES}
            {...(eager ? { loading: "eager" as const } : {})}
            className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-[1.035]"
          />
        ) : null}
        {product.tag ? (
          <ProductTagBadge tag={product.tag} className="absolute top-3 left-3" />
        ) : null}
        {soldOut ? (
          <span className="absolute inset-0 flex items-center justify-center bg-ivory/60 text-[11px] font-bold tracking-[.24em] text-off uppercase">
            Agotado
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 pt-4">
        <p className="m-0 flex items-center gap-2 text-[11px] tracking-[.16em] text-muted uppercase">
          <CategoryIcon category={product.category} className="size-3.5 flex-none text-gold-ink" />
          <span>
            {productLabel(product)} · {product.brand}
          </span>
        </p>
        <h3 className="m-0 type-serif text-base leading-[1.22] md:text-[19px]">
          <Link
            href={href}
            className="no-underline group-hover/card:underline group-hover/card:decoration-gold group-hover/card:underline-offset-4"
          >
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 mb-0 text-sm">
          <small className="block text-[11px] tracking-[.06em] text-muted">
            {product.priceFromCop ? "Valor inicial desde" : "Valor inicial"}
          </small>
          <b className="text-sm font-semibold md:text-base">
            {product.priceFromCop
              ? formatCOP(product.priceFromCop, { suffix: true })
              : "Valor por confirmar"}
          </b>
        </p>
        <p className="m-0 text-[11px] text-muted">Precio final sujeto a cotización</p>
        <AvailabilityStatus availability={product.availability} />
        {isHealthProduct(product) ? <HealthNote /> : null}

        <div className="mt-auto flex flex-col gap-2 pt-2.5">
          {showSelect ? (
            <>
              <label htmlFor={selectId} className="sr-only">
                {group.name}
              </label>
              <Select
                ref={selectRef}
                id={selectId}
                value={selections[group.name] ?? ""}
                disabled={soldOut}
                aria-invalid={error || undefined}
                aria-describedby={error ? `${selectId}-error` : undefined}
                className={cn(error && "border-off")}
                onChange={(event) => {
                  setError(false);
                  setSelections((current) => ({ ...current, [group.name]: event.target.value }));
                }}
              >
                <option value="">{group.name}: elige una opción</option>
                {group.options.map((option) => (
                  <option key={option.value} value={option.value} disabled={option.soldOut}>
                    {option.value}
                    {option.soldOut ? " · agotada" : ""}
                  </option>
                ))}
              </Select>
              {error ? (
                <span id={`${selectId}-error`} className="text-xs text-off" role="alert">
                  Elige {group.name.toLowerCase()} para agregarlo.
                </span>
              ) : null}
            </>
          ) : null}

          {soldOut ? (
            <Link
              href="/encargos"
              className="inline-flex min-h-11 w-full items-center justify-center rounded-sm border border-navy px-2.5 text-[11px] font-semibold tracking-[.08em] text-navy uppercase no-underline md:px-4 md:text-xs md:tracking-[.12em]"
            >
              Avísame o pide similar
            </Link>
          ) : inCart ? (
            <Button
              variant="added"
              size="sm"
              block
              onClick={openDrawer}
              className="px-2.5 text-[11px] tracking-[.08em] md:px-4 md:text-xs md:tracking-[.12em]"
            >
              <CheckIcon />
              Agregado · Ver pedido
            </Button>
          ) : (
            <Button
              variant="navy"
              size="sm"
              block
              onClick={onAdd}
              className="px-2.5 text-[11px] tracking-[.08em] md:px-4 md:text-xs md:tracking-[.12em]"
            >
              <BagIcon />
              Agregar a mi pedido
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
