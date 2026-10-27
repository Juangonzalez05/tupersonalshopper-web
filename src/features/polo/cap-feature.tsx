"use client";

import Link from "next/link";
import { useState } from "react";
import { site } from "@/config/site";
import { formatCOP } from "@/domain/money";
import { defaultSelections, productPath, type Product } from "@/domain/product";
import { productQuestionMessage, whatsappUrl } from "@/domain/whatsapp";
import { Button, buttonVariants } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { Eyebrow } from "@/components/ui/typography";
import { CheckIcon } from "@/components/icons/icons";
import { useAddToCart } from "@/features/cart/use-add-to-cart";
import { VariantPicker } from "@/features/product/variant-picker";

/** Bloque de la gorra: 25 colores en origen y agregar al pedido sin salir de la colección. */
export function CapFeature({ product }: { product: Product }) {
  const [selections, setSelections] = useState(() => defaultSelections(product));
  const { add, inCart, openDrawer } = useAddToCart(product, selections);
  const group = product.variants[0];

  return (
    <section className="wrap sec" aria-labelledby="gor-t">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
        <div className="grid grid-cols-2 gap-4">
          {product.images.slice(0, 2).map((image) => (
            <Photo
              key={image.src}
              src={image.src}
              alt={`${image.alt}, foto de referencia`}
              sizes="(min-width: 761px) 25vw, 50vw"
            />
          ))}
        </div>
        <div className="flex flex-col gap-5">
          <Eyebrow>Accesorios · Gorras</Eyebrow>
          <h2 id="gor-t" className="type-h2">
            <Link
              href={productPath(product)}
              className="no-underline hover:underline hover:decoration-gold"
            >
              {product.name}
            </Link>
          </h2>
          <p className="type-lead text-muted">{product.description}</p>
          {product.priceFromCop ? (
            <div className="flex flex-col gap-1 border-y border-line py-5">
              <span className="type-eyebrow text-muted">Valor inicial desde</span>
              <span className="type-serif text-[32px]">
                {formatCOP(product.priceFromCop, { suffix: true })}
              </span>
              <span className="type-small text-muted">Precio final sujeto a cotización.</span>
            </div>
          ) : null}
          {group ? (
            <VariantPicker
              group={group}
              value={selections[group.name]}
              onChange={(value) => setSelections({ ...selections, [group.name]: value })}
            />
          ) : null}
          <div className="flex flex-wrap gap-3">
            {inCart ? (
              <Button variant="added" onClick={openDrawer}>
                <CheckIcon />
                Agregada · Ver pedido
              </Button>
            ) : (
              <Button variant="gold" onClick={() => add()}>
                Agregar a mi pedido
              </Button>
            )}
            <a
              href={whatsappUrl(
                site.whatsappNumber,
                productQuestionMessage(
                  product.name,
                  product.brand,
                  `${site.url}${productPath(product)}`,
                ) + "\n¿Qué colores tienen disponibles?",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonVariants({ variant: "line" })}
            >
              Consultar colores
            </a>
          </div>
          {product.availabilityNote ? (
            <p className="m-0 type-small text-muted">{product.availabilityNote}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
