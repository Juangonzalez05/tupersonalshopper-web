import type { Metadata } from "next";
import { site } from "@/config/site";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Eyebrow } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Tratamiento de datos personales",
  description: "Cómo usamos los datos que nos compartes al solicitar una cotización o un encargo.",
  alternates: { canonical: "/politica-de-datos" },
};

const sections = [
  {
    title: "Qué datos recibimos",
    text: "Tu nombre, ciudad, número de WhatsApp, comentarios y la lista de productos que quieres cotizar. El sitio no guarda estos datos en un servidor: viajan dentro del mensaje de WhatsApp que tú decides enviar. Tu lista de pedido se guarda solo en tu navegador.",
  },
  {
    title: "Para qué los usamos",
    text: "Para cotizar, confirmar disponibilidad, coordinar la compra y el envío, y atender tus preguntas por WhatsApp. No los vendemos ni los compartimos con terceros con fines comerciales.",
  },
  {
    title: "Tus derechos",
    text: "Puedes conocer, actualizar, rectificar o pedir que eliminemos tus datos, y revocar tu autorización, escribiéndonos por WhatsApp. Responderemos dentro de los plazos de la Ley 1581 de 2012.",
  },
  {
    title: "Responsable",
    text: `${site.name} · [Nombre o razón social, documento y datos de contacto por confirmar]. Esta política está pendiente de revisión y aprobación por parte de ${site.name}.`,
  },
];

export default function DataPolicyPage() {
  return (
    <div className="wrap pb-24">
      <Breadcrumbs items={[{ label: "Tratamiento de datos" }]} />
      <header className="flex max-w-[760px] flex-col gap-3 pt-5 pb-10">
        <Eyebrow>Política de privacidad</Eyebrow>
        <h1 className="type-h1">Tratamiento de datos personales</h1>
        <p className="type-lead text-muted">
          Cuando nos pides una cotización o un encargo, usamos tus datos solo para atender esa
          solicitud.
        </p>
      </header>
      <div className="flex max-w-[760px] flex-col gap-8">
        {sections.map((section) => (
          <section key={section.title} className="flex flex-col gap-2 border-t border-line pt-6">
            <h2 className="type-h3">{section.title}</h2>
            <p className="m-0 text-[15px] text-muted">{section.text}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
