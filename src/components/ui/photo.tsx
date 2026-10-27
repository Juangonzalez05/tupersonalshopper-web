import Image from "next/image";
import { cn } from "@/lib/cn";

/**
 * Foto 4:5 sobre el fondo neutro del diseño. `sizes` es obligatorio para que next/image
 * descargue el ancho justo en cada pantalla. `eager` es para la foto principal visible al cargar.
 */
export function Photo({
  src,
  alt,
  sizes,
  eager,
  className,
  imageClassName,
  ratio = "aspect-[4/5]",
}: {
  src: string;
  alt: string;
  sizes: string;
  eager?: boolean;
  className?: string;
  imageClassName?: string;
  ratio?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-tile", ratio, className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        {...(eager ? { loading: "eager" as const, fetchPriority: "high" as const } : {})}
        className={cn("object-cover", imageClassName)}
      />
    </div>
  );
}
