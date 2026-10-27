"use client";

import { lineKey } from "@/domain/cart";
import {
  imageIndexForSelections,
  isHealthProduct,
  productLabel,
  type Product,
  type Selections,
} from "@/domain/product";
import { useCart, useCartHydrated } from "./store";

/** Agregar un producto con sus variantes al pedido, y saber si esa combinación ya está. */
export function useAddToCart(product: Product, selections: Selections) {
  const add = useCart((s) => s.add);
  const openDrawer = useCart((s) => s.setDrawerOpen);
  const ready = useCartHydrated();
  const key = lineKey(product.id, selections);
  const inCart = useCart((s) => s.lines.some((line) => line.key === key));

  return {
    inCart: ready && inCart,
    openDrawer: () => openDrawer(true),
    add: (qty = 1) => {
      const image =
        product.images[imageIndexForSelections(product, selections)] ?? product.images[0];
      add(
        {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          brand: product.brand,
          categoryLabel: productLabel(product),
          image: image?.src ?? "",
          priceFromCop: product.priceFromCop,
          // Mismo orden que los grupos del producto ("Talla: M · Color: …").
          selections: Object.fromEntries(
            product.variants
              .filter((group) => selections[group.name])
              .map((group) => [group.name, selections[group.name]!]),
          ),
          health: isHealthProduct(product),
        },
        qty,
      );
    },
  };
}
