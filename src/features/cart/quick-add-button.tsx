"use client";

import Link from "next/link";
import { useState } from "react";
import { defaultSelections, missingSelections, productPath, type Product } from "@/domain/product";
import { Button, buttonVariants } from "@/components/ui/button";
import { CheckIcon } from "@/components/icons/icons";
import { useAddToCart } from "./use-add-to-cart";

/**
 * Agregar con un clic (rankings, listas compactas). Si el producto necesita elegir talla o
 * aroma, lleva al detalle en vez de agregar algo incompleto.
 */
export function QuickAddButton({ product }: { product: Product }) {
  const [selections] = useState(() => defaultSelections(product));
  const { add, inCart, openDrawer } = useAddToCart(product, selections);
  const missing = missingSelections(product, selections);

  if (missing.length) {
    return (
      <Link
        href={productPath(product)}
        className={buttonVariants({ variant: "line", size: "sm", block: true })}
      >
        Elegir {missing[0]!.name.toLowerCase()}
      </Link>
    );
  }
  return inCart ? (
    <Button variant="added" size="sm" block onClick={openDrawer}>
      <CheckIcon />
      Agregado · Ver pedido
    </Button>
  ) : (
    <Button variant="line" size="sm" block onClick={() => add()}>
      Agregar a mi pedido
    </Button>
  );
}
