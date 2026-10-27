import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

/** Marca circular oficial + nombre en texto, como en el diseño. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name}, ir al inicio`}
      className={cn("flex flex-none items-center gap-3 text-ivory no-underline", className)}
    >
      <Image
        src="/brand/logo-mark.webp"
        alt=""
        width={48}
        height={48}
        className="size-10 rounded-full md:size-12"
      />
      <span className="flex flex-col leading-[1.05]">
        <b className="type-serif text-[17px] font-normal tracking-[.01em] md:text-[21px]">
          {site.name}
        </b>
        <small className="mt-1 text-[8px] tracking-[.26em] text-gold uppercase md:text-[9px] md:tracking-[.32em]">
          {site.tagline}
        </small>
      </span>
    </Link>
  );
}
