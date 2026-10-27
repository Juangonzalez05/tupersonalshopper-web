import type { Metadata } from "next";
import { site } from "@/config/site";
import { whatsappUrl } from "@/domain/whatsapp";
import { Steps } from "@/components/layout/steps";
import { JsonLd } from "@/components/seo/json-ld";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/typography";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Cómo funciona y preguntas frecuentes",
  description:
    "Eliges, cotizamos, compramos en Estados Unidos y coordinamos el envío a Colombia. Sin pagos en línea: el precio final te lo confirmamos por WhatsApp.",
  alternates: { canonical: "/como-funciona" },
};

const steps = [
  {
    title: "Arma tu lista",
    text: "Explora el catálogo, elige talla, color o aroma y agrega a “Mi pedido”. Si no encuentras algo, haz un encargo con el enlace.",
  },
  {
    title: "Solicita la cotización",
    text: "Déjanos tu nombre, ciudad y WhatsApp. Se abre una conversación con tu lista lista para enviar.",
  },
  {
    title: "Confirmamos contigo",
    text: "Revisamos cada producto en la tienda y te enviamos precio final, disponibilidad, tiempos y forma de pago.",
  },
  {
    title: "Compramos y enviamos",
    text: "Con tu aprobación compramos en EE. UU. y coordinamos el envío hasta tu ciudad en Colombia.",
  },
];

const faq: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "Pedidos y cotización",
    items: [
      {
        q: "¿Tengo que pagar para pedir una cotización?",
        a: "No. Armar tu lista y solicitar la cotización no tiene costo. Solo pagas cuando confirmas el pedido por WhatsApp.",
      },
      {
        q: "¿Por qué no puedo pagar en la página?",
        a: "Porque cada compra se revisa a mano: confirmamos precio y disponibilidad en la tienda antes de cobrarte. Así evitas pagar por algo agotado o con otro precio.",
      },
      {
        q: "¿El valor inicial es el precio final?",
        a: "No. Es una referencia. El precio final incluye el valor del día en la tienda, el envío y la importación, y te lo enviamos antes de comprar.",
      },
    ],
  },
  {
    group: "Pagos y envíos",
    items: [
      {
        q: "¿Cómo pago mi pedido?",
        a: "Te compartimos los medios de pago al confirmar por WhatsApp. [Medios de pago por confirmar con Tu Shopper USA].",
      },
      {
        q: "¿Cuánto tarda en llegar?",
        a: "Depende de la tienda y de la ciudad de destino. [Tiempo estimado por confirmar]. Te damos una fecha estimada en la cotización.",
      },
      {
        q: "¿A qué ciudades envían?",
        a: "[Cobertura de envío por confirmar]. Indícanos tu ciudad en el formulario y te confirmamos.",
      },
    ],
  },
  {
    group: "Productos",
    items: [
      {
        q: "¿Dónde compran los productos?",
        a: "En tiendas de Estados Unidos como Walmart, Amazon y otras que tú puedes consultar. Somos un servicio independiente: no somos tienda oficial ni distribuidores de las marcas.",
      },
      {
        q: "¿Puedo pedir vitaminas, suplementos o medicamentos?",
        a: "Sí, con consulta previa de viabilidad de importación para cada producto. No damos recomendaciones médicas ni de uso; consulta siempre a tu profesional de salud.",
      },
      {
        q: "¿Cómo sé qué talla pedir?",
        a: "Te compartimos la guía de tallas de la tienda de origen al cotizar. Si tienes dudas entre dos tallas, cuéntanos en comentarios.",
      },
      {
        q: "¿Puedo cambiar o devolver un producto?",
        a: "[Política de cambios y devoluciones por confirmar con Tu Shopper USA].",
      },
    ],
  },
  {
    group: "Encargos",
    items: [
      {
        q: "¿Pueden comprar algo que no está en el catálogo?",
        a: "Sí. Usa el formulario de encargo personalizado con el enlace o la descripción del producto y te lo cotizamos.",
      },
    ],
  },
];

export default function HowItWorksPage() {
  // Las respuestas con datos "[por confirmar]" no se publican en los datos estructurados.
  const confirmed = faq.flatMap((g) => g.items).filter((item) => !item.a.includes("["));
  return (
    <>
      <section className="bg-navy text-ivory">
        <div className="wrap flex flex-col gap-[22px] pt-16 pb-[72px] md:pt-20 md:pb-[88px]">
          <Eyebrow onDark>Cómo funciona</Eyebrow>
          <h1 className="type-display max-w-[17ch] text-ivory">
            Compras en Estados Unidos, con alguien que lo hace por ti.
          </h1>
          <p className="type-lead max-w-[58ch] text-on-navy">
            Tu Shopper USA es un servicio de personal shopper: eliges, nosotros cotizamos, compramos
            y coordinamos el envío a Colombia. Sin pasarela de pago y sin sorpresas.
          </p>
        </div>
      </section>

      <section className="wrap sec" aria-labelledby="pasos-t">
        <h2 id="pasos-t" className="sr-only">
          Los cuatro pasos
        </h2>
        <Steps steps={steps} />
      </section>

      <section className="bg-mist">
        <div className="wrap grid grid-cols-1 items-center gap-8 sec-sm md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-3.5">
            <Eyebrow>Sobre los valores</Eyebrow>
            <h2 className="type-h2">¿Qué es el “valor inicial”?</h2>
          </div>
          <div className="flex flex-col gap-3.5">
            <p className="type-lead text-muted">
              Es un valor de referencia para que planees tu compra. El precio final depende del
              precio en la tienda el día de la compra, el envío y la importación, y siempre te lo
              confirmamos por WhatsApp antes de comprar.
            </p>
            <p className="m-0 type-small text-muted">
              Cuando un producto dice “Valor por confirmar”, lo cotizamos contigo sin compromiso.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap sec" id="preguntas" aria-labelledby="faq-t">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-12">
          <div className="flex flex-col gap-4 lg:sticky lg:top-40">
            <Eyebrow>Preguntas frecuentes</Eyebrow>
            <h2 id="faq-t" className="type-h2">
              Lo que más nos preguntan
            </h2>
            <p className="m-0 type-small text-muted">
              ¿No encuentras tu respuesta? Escríbenos y te ayudamos.
            </p>
            <a
              href={whatsappUrl(site.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "gold" }), "self-start")}
            >
              Escribir por WhatsApp
            </a>
          </div>
          <div className="flex flex-col gap-10">
            {faq.map((group, groupIndex) => (
              <div key={group.group}>
                <h3 className="type-eyebrow mb-2 text-gold-ink">{group.group}</h3>
                <Accordion>
                  {group.items.map((item, index) => (
                    <AccordionItem
                      key={item.q}
                      title={item.q}
                      defaultOpen={groupIndex === 0 && index === 0}
                    >
                      {item.a}
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: confirmed.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: item.a },
          })),
        }}
      />
    </>
  );
}
