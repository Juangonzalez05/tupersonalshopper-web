import type { Metadata } from "next";
import { site } from "@/config/site";
import { whatsappUrl } from "@/domain/whatsapp";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { buttonVariants } from "@/components/ui/button";
import { HealthNote } from "@/components/ui/status";
import { Eyebrow } from "@/components/ui/typography";
import { HangerIcon, HouseIcon, LaptopIcon, LipstickIcon } from "@/components/icons/icons";
import { CustomOrderForm } from "@/features/custom-order/custom-order-form";

export const metadata: Metadata = {
  title: "Encargo personalizado",
  description:
    "¿No está en el catálogo? Pega el enlace de Walmart, Amazon u otra tienda de Estados Unidos y te lo cotizamos por WhatsApp.",
  alternates: { canonical: "/encargos" },
};

const howTo = [
  { title: "Nos cuentas qué buscas", text: "Enlace, foto o descripción." },
  { title: "Revisamos viabilidad", text: "Disponibilidad, envío e importación a Colombia." },
  { title: "Te cotizamos por WhatsApp", text: "Tú decides si compramos." },
];

const usual = [
  { Icon: LaptopIcon, label: "Tecnología" },
  { Icon: HouseIcon, label: "Hogar y cocina" },
  { Icon: HangerIcon, label: "Tallas especiales" },
  { Icon: LipstickIcon, label: "Maquillaje y skincare" },
];

export default function CustomOrderPage() {
  return (
    <div className="wrap pb-24">
      <Breadcrumbs items={[{ label: "Encargo personalizado" }]} />
      <header className="flex max-w-[760px] flex-col gap-3 pt-5 pb-12">
        <Eyebrow>Encargo personalizado</Eyebrow>
        <h1 className="type-h1">¿No está en el catálogo? Te lo buscamos.</h1>
        <p className="type-lead text-muted">
          Pega el enlace de Walmart, Amazon u otra tienda de Estados Unidos, cuéntanos talla, color
          o cantidad, y te enviamos la cotización por WhatsApp.
        </p>
      </header>

      <div className="grid grid-cols-1 items-start gap-9 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-14">
        <section aria-labelledby="enc-t" className="border border-line bg-white p-[22px] md:p-8">
          <CustomOrderForm />
        </section>

        <aside className="flex flex-col gap-8" aria-label="Información sobre encargos">
          <div className="flex flex-col gap-[18px]">
            <Eyebrow>Cómo funciona un encargo</Eyebrow>
            <ol className="m-0 list-none border-t border-gold p-0">
              {howTo.map((step, index) => (
                <li key={step.title} className="flex gap-[18px] border-b border-line py-[18px]">
                  <span
                    className="type-serif text-[28px] leading-none text-gold"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <span>
                    <b className="font-semibold">{step.title}</b>
                    <br />
                    <span className="type-small text-muted">{step.text}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col gap-4 bg-mist p-7">
            <Eyebrow>Lo que suelen encargarnos</Eyebrow>
            <ul className="m-0 grid list-none grid-cols-2 gap-4 p-0">
              {usual.map(({ Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5 text-sm">
                  <Icon className="size-[22px] flex-none text-gold-ink" />
                  {label}
                </li>
              ))}
            </ul>
            <HealthNote>
              Vitaminas, suplementos y medicamentos de venta libre: consulta previa de viabilidad de
              importación.
            </HealthNote>
          </div>
          <a
            href={whatsappUrl(site.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "line" })}
          >
            Prefiero escribir por WhatsApp
          </a>
        </aside>
      </div>
    </div>
  );
}
