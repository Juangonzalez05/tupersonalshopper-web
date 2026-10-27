import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/typography";

export default function NotFound() {
  return (
    <section className="wrap flex flex-col items-center gap-6 py-24 text-center">
      <Eyebrow>Error 404</Eyebrow>
      <h1 className="type-h1">No encontramos esta página</h1>
      <p className="type-lead max-w-[46ch] text-muted">
        Puede que el producto ya no esté en el catálogo. Búscalo de nuevo o pídelo como encargo y te
        lo cotizamos.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/catalogo" className={buttonVariants({ variant: "gold" })}>
          Ir al catálogo
        </Link>
        <Link href="/encargos" className={buttonVariants({ variant: "line" })}>
          Hacer un encargo
        </Link>
      </div>
    </section>
  );
}
