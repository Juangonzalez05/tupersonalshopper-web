"use client";

import Link from "next/link";
import { useId } from "react";
import type { VariantGroup } from "@/domain/product";
import { Chip } from "@/components/ui/chip";
import { Select } from "@/components/ui/field";
import { cn } from "@/lib/cn";

/** Selector de una variante: círculos de color, chips (tallas) o lista (aroma, presentación). */
export function VariantPicker({
  group,
  value,
  onChange,
  error,
}: {
  group: VariantGroup;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: boolean;
}) {
  const id = useId();
  const errorId = `${id}-error`;
  const many = group.options.length > 12;

  return (
    <fieldset
      className="m-0 flex flex-col gap-3 border-0 p-0"
      aria-describedby={error ? errorId : undefined}
    >
      <div className="flex items-baseline justify-between gap-4">
        <legend className="p-0 text-[13px]">
          <b className="type-label">{group.name}:</b>{" "}
          {group.display === "select" ? null : <span>{value ?? "elige una opción"}</span>}
        </legend>
        {group.name === "Talla" ? (
          <Link
            href="/como-funciona#preguntas"
            className="type-small underline decoration-gold underline-offset-4"
          >
            Guía de tallas
          </Link>
        ) : null}
      </div>

      {group.display === "swatches" ? (
        <div role="radiogroup" aria-label={group.name} className="flex flex-wrap gap-2.5">
          {group.options.map((option) => {
            const on = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={option.value}
                title={option.value}
                onClick={() => onChange(option.value)}
                className={cn(
                  "rounded-full border bg-transparent",
                  many ? "size-9 p-[3px]" : "size-11 p-1",
                  on ? "border-navy ring-1 ring-gold" : "border-line-2",
                )}
              >
                <span
                  className="block size-full rounded-full"
                  style={{ background: option.swatch }}
                />
              </button>
            );
          })}
        </div>
      ) : group.display === "chips" ? (
        <div role="radiogroup" aria-label={group.name} className="flex flex-wrap gap-2">
          {group.options.map((option) => {
            const on = option.value === value;
            return (
              <Chip
                key={option.value}
                role="radio"
                aria-checked={on}
                aria-disabled={option.soldOut || undefined}
                aria-label={
                  option.soldOut ? `${option.value}, agotada en la tienda de origen` : option.value
                }
                shape={option.value.length <= 4 ? "square" : "pill"}
                pressed={on}
                soldOut={option.soldOut}
                onClick={() => {
                  if (!option.soldOut) onChange(option.value);
                }}
              >
                {option.value}
              </Chip>
            );
          })}
        </div>
      ) : (
        <Select
          aria-label={group.name}
          value={value ?? ""}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error || undefined}
          className={cn("h-[52px] text-[15px]", error && "border-off")}
        >
          <option value="">Elige {group.name.toLowerCase()}</option>
          {group.options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.soldOut}>
              {option.value}
              {option.soldOut ? " · agotada" : ""}
            </option>
          ))}
        </Select>
      )}

      {error ? (
        <span id={errorId} role="alert" className="text-xs text-off">
          Elige {group.name.toLowerCase()} para agregarlo a tu pedido.
        </span>
      ) : null}
      {group.note ? <p className="m-0 type-small text-muted">{group.note}</p> : null}
    </fieldset>
  );
}
