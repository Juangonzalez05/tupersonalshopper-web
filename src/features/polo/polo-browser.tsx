"use client";

import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { useMemo } from "react";
import {
  POLO_LINES,
  poloColorOptions,
  poloLineCounts,
  poloSizeOptions,
  queryPolo,
} from "@/domain/polo";
import type { Product } from "@/domain/product";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Eyebrow } from "@/components/ui/typography";
import { ProductGrid } from "@/features/catalog/product-grid";

const parsers = {
  linea: parseAsStringLiteral(["hombre", "ninos", "gorras"] as const),
  talla: parseAsString.withDefault(""),
  color: parseAsString.withDefault(""),
};

export function PoloBrowser({ products }: { products: Product[] }) {
  const [params, setParams] = useQueryStates(parsers, { history: "replace", scroll: false });
  const line = params.linea ?? undefined;
  const visible = useMemo(
    () =>
      queryPolo(products, {
        line,
        size: params.talla || undefined,
        color: params.color || undefined,
      }),
    [products, line, params.talla, params.color],
  );
  const lines = poloLineCounts(products);
  const sizes = poloSizeOptions(line);
  const colors = poloColorOptions(products, line);
  const lineLabel = POLO_LINES.find((l) => l.value === (line ?? "all"))?.label;

  return (
    <>
      <div className="mb-7 flex flex-col items-start gap-3.5 md:mb-10 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2.5">
          <Eyebrow>{lineLabel}</Eyebrow>
          <h2 id="pr-t" className="type-h2">
            Prendas de la colección
          </h2>
        </div>
        <p aria-live="polite" className="m-0 text-sm">
          <b>{visible.length}</b> {visible.length === 1 ? "prenda" : "prendas"}
        </p>
      </div>

      <div className="mb-10 flex flex-col gap-5 border-b border-line pb-8">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Línea">
          {lines.map((item) => {
            const on = (line ?? "all") === item.value;
            return (
              <Chip
                key={item.value}
                pressed={on}
                aria-pressed={on}
                onClick={() =>
                  void setParams({
                    linea: item.value === "all" ? null : item.value,
                    talla: "",
                    color: "",
                  })
                }
              >
                {item.label} <span className="opacity-70">{item.count}</span>
              </Chip>
            );
          })}
        </div>
        <div className="flex flex-wrap items-start gap-8">
          {sizes.length ? (
            <div className="flex flex-col gap-2.5">
              <span className="type-eyebrow text-muted">Talla</span>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por talla">
                {sizes.map((size) => (
                  <Chip
                    key={size}
                    shape="square"
                    pressed={params.talla === size}
                    aria-pressed={params.talla === size}
                    onClick={() => void setParams({ talla: params.talla === size ? "" : size })}
                  >
                    {size}
                  </Chip>
                ))}
              </div>
            </div>
          ) : null}
          <div className="flex flex-col gap-2.5">
            <span className="type-eyebrow text-muted">Color</span>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por color">
              {colors.map((color) => (
                <Chip
                  key={color.value}
                  pressed={params.color === color.value}
                  aria-pressed={params.color === color.value}
                  onClick={() =>
                    void setParams({ color: params.color === color.value ? "" : color.value })
                  }
                >
                  <span
                    className="border-black/10 size-3.5 rounded-full border"
                    style={{ background: color.swatch }}
                    aria-hidden="true"
                  />
                  {color.value}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      </div>

      {visible.length ? (
        <ProductGrid products={visible} />
      ) : (
        <div className="flex flex-col items-center gap-3 border border-line bg-white p-6 text-center md:p-8">
          <h3 className="type-h3">No hay prendas con esa combinación</h3>
          <p className="m-0 type-small text-muted">
            Prueba otra talla o pídenos la prenda exacta como encargo.
          </p>
          <Button variant="line" size="sm" onClick={() => void setParams({ talla: "", color: "" })}>
            Quitar filtros
          </Button>
        </div>
      )}
    </>
  );
}
