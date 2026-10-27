import Link from "next/link";
import { site } from "@/config/site";
import { whatsappUrl } from "@/domain/whatsapp";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/typography";

export function CtaBand() {
  return (
    <section className="wrap sec" aria-labelledby="cta-t">
      <div className="grid grid-cols-1 items-center gap-8 border-t border-gold pt-14 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col gap-4">
          <Eyebrow>Encargos personalizados</Eyebrow>
          <h2 id="cta-t" className="type-h2">
            ¿Buscas algo que no está en el catálogo?
          </h2>
          <p className="type-lead max-w-[46ch] text-muted">
            Tecnología, hogar, una talla específica o ese producto que viste en redes. Pégalo en un
            encargo y te lo cotizamos.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          <Link href="/encargos" className={buttonVariants({ variant: "gold" })}>
            Hacer un encargo
          </Link>
          <a
            href={whatsappUrl(site.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "line" })}
          >
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
