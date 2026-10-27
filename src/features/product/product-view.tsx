"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { site } from "@/config/site";
import { formatCOP } from "@/domain/money";
import {
  CATEGORY_INFO,
  defaultSelections,
  imageIndexForSelections,
  isHealthProduct,
  missingSelections,
  productPath,
  type Product,
  type Selections,
} from "@/domain/product";
import { productQuestionMessage, whatsappUrl } from "@/domain/whatsapp";
import { Button, buttonVariants } from "@/components/ui/button";
import { AvailabilityStatus, HealthNote } from "@/components/ui/status";
import { BagIcon, CategoryIcon, CheckIcon, WhatsAppIcon } from "@/components/icons/icons";
import { QtyStepper } from "@/features/cart/qty-stepper";
import { useAddToCart } from "@/features/cart/use-add-to-cart";
import { cn } from "@/lib/cn";
import { Gallery } from "./gallery";
import { VariantPicker } from "./variant-picker";

const POLO_LINE_LABELS = { hombre: "Hombre", ninos: "Niños", gorras: "Gorras" } as const;

function categoryLine(product: Product): string {
  const base = CATEGORY_INFO[product.category].shortLabel;
  if (product.polo) return `${base} · Colección Polo · ${POLO_LINE_LABELS[product.polo.line]}`;
  return `${base} · ${product.subcategory}`;
}

/** Galería + compra. `details` son los acordeones (se renderizan en el servidor). */
export function ProductView({ product, details }: { product: Product; details: ReactNode }) {
  const [selections, setSelections] = useState<Selections>(() => defaultSelections(product));
  const [imageIndex, setImageIndex] = useState(() =>
    imageIndexForSelections(product, defaultSelections(product)),
  );
  const [qty, setQty] = useState(1);
  const [showErrors, setShowErrors] = useState(false);
  const { add, inCart } = useAddToCart(product, selections);

  const missing = missingSelections(product, selections);
  const health = isHealthProduct(product);
  const questionUrl = whatsappUrl(
    site.whatsappNumber,
    productQuestionMessage(product.name, product.brand, `${site.url}${productPath(product)}`),
  );

  const select = (group: string, value: string) => {
    const next = { ...selections, [group]: value };
    setSelections(next);
    const variantImage = product.images.findIndex((image) => image.variant === value);
    if (variantImage >= 0) setImageIndex(variantImage);
  };

  const onAdd = () => {
    if (missing.length) {
      setShowErrors(true);
      return;
    }
    add(qty);
    setQty(1);
  };

  return (
    <section
      aria-labelledby="producto-t"
      className="grid grid-cols-1 items-start gap-7 pt-3 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-10 md:pt-6 lg:gap-16"
    >
      <Gallery
        images={product.images}
        index={imageIndex}
        onIndexChange={setImageIndex}
        tag={product.tag}
      />

      <div className="flex flex-col gap-[22px]">
        <div className="flex flex-col gap-2.5">
          <p className="m-0 flex items-center gap-2 text-xs tracking-[.16em] text-muted uppercase">
            <CategoryIcon category={product.category} className="size-3.5 text-gold-ink" />
            {categoryLine(product)}
          </p>
          <h1 id="producto-t" className="type-h1 md:text-[48px]">
            {product.name}
          </h1>
          <p className="m-0 text-sm text-muted">
            Marca: <b className="font-semibold text-ink">{product.brand}</b> · Comprado en tienda de
            EE. UU.
          </p>
        </div>

        <div className="flex flex-col gap-1 border-y border-line py-5">
          <span className="type-eyebrow text-muted">
            {product.priceFromCop ? "Valor inicial desde" : "Valor inicial de referencia"}
          </span>
          <span className="type-serif text-[30px]">
            {product.priceFromCop
              ? formatCOP(product.priceFromCop, { suffix: true })
              : "Valor por confirmar"}
          </span>
          <span className="type-small text-muted">
            Precio final sujeto a cotización. Te lo confirmamos por WhatsApp junto con el envío.
          </span>
        </div>

        {product.variants.map((group) => (
          <VariantPicker
            key={group.name}
            group={group}
            value={selections[group.name]}
            onChange={(value) => select(group.name, value)}
            error={showErrors && missing.includes(group)}
          />
        ))}

        <div className="flex flex-wrap items-stretch gap-3">
          <QtyStepper value={qty} onChange={setQty} tall label={product.name} />
          {inCart ? (
            <Link
              href="/mi-pedido"
              className={cn(buttonVariants({ variant: "added", size: "lg" }), "flex-1")}
              aria-live="polite"
            >
              <CheckIcon />
              Agregado · Ver mi pedido
            </Link>
          ) : (
            <Button variant="gold" size="lg" className="flex-1" onClick={onAdd}>
              <BagIcon />
              Agregar a mi pedido
            </Button>
          )}
        </div>
        {inCart ? (
          <button
            type="button"
            onClick={() => add(qty)}
            className="-mt-3 self-start border-0 bg-transparent p-0 text-[13px] text-muted underline decoration-gold underline-offset-4"
          >
            Agregar {qty} {qty === 1 ? "unidad" : "unidades"} más
          </button>
        ) : null}
        <a
          href={questionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "line" })}
        >
          <WhatsAppIcon />
          Preguntar por este producto
        </a>

        <div className="flex flex-col gap-2">
          <AvailabilityStatus
            availability={product.availability}
            label={
              product.availability === "confirmar"
                ? "Disponibilidad por confirmar con la tienda de origen"
                : undefined
            }
          />
          {product.availabilityNote ? (
            <p className="m-0 type-small text-muted">{product.availabilityNote}</p>
          ) : null}
          {health ? (
            <HealthNote>
              Consulta previa de viabilidad de importación. No ofrecemos recomendaciones médicas;
              consulta a tu profesional de salud.
            </HealthNote>
          ) : null}
        </div>

        {details}
      </div>
    </section>
  );
}
