import type { Product } from "@/domain/product";
import { cn } from "@/lib/cn";
import { ProductCard } from "./product-card";

/** Grilla de 4 columnas (3 en tableta, 2 en móvil), como `.g4` del diseño. */
export const gridClass =
  "grid grid-cols-2 gap-x-3.5 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-4";

export function ProductGrid({
  products,
  className,
  eagerCount = 0,
}: {
  products: Product[];
  className?: string;
  eagerCount?: number;
}) {
  return (
    <ul className={cn(gridClass, "m-0 list-none p-0", className)}>
      {products.map((product, index) => (
        <li key={product.id} className="min-w-0">
          <ProductCard product={product} eager={index < eagerCount} />
        </li>
      ))}
    </ul>
  );
}
