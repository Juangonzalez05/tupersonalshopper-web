"use client";

import Image from "next/image";
import type { ProductImage, ProductTag } from "@/domain/product";
import { ProductTagBadge } from "@/components/ui/tag";
import { cn } from "@/lib/cn";

export function Gallery({
  images,
  index,
  onIndexChange,
  tag,
}: {
  images: ProductImage[];
  index: number;
  onIndexChange: (index: number) => void;
  tag?: ProductTag;
}) {
  const current = images[index] ?? images[0];
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[88px_minmax(0,1fr)]">
      {images.length > 1 ? (
        <div
          role="group"
          aria-label="Fotos del producto"
          className="order-2 flex flex-row gap-3 overflow-x-auto md:order-none md:flex-col"
        >
          {images.map((image, i) => (
            <button
              key={image.src}
              type="button"
              aria-label={`Ver foto ${i + 1} de ${images.length}${image.variant ? `: ${image.variant}` : ""}`}
              aria-pressed={i === index}
              onClick={() => onIndexChange(i)}
              className={cn(
                "relative aspect-[4/5] w-[72px] flex-none overflow-hidden border bg-tile p-0 md:w-[88px]",
                i === index
                  ? "border-navy outline outline-1 outline-offset-2 outline-gold"
                  : "border-transparent",
              )}
            >
              <Image src={image.src} alt="" fill sizes="88px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
      <div
        className={cn(
          "relative aspect-[4/5] overflow-hidden bg-tile",
          images.length <= 1 && "md:col-span-2",
        )}
      >
        {current ? (
          <Image
            src={current.src}
            alt={current.alt}
            fill
            sizes="(min-width: 761px) 50vw, 100vw"
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
        ) : null}
        {tag ? <ProductTagBadge tag={tag} className="absolute top-4 left-4" /> : null}
      </div>
    </div>
  );
}
