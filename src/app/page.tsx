import { catalog, curation, editorial } from "@/data";
import { categoryPath } from "@/domain/product";
import { Steps, howItWorksSteps } from "@/components/layout/steps";
import { SectionHead, SectionLink } from "@/components/ui/typography";
import { ProductGrid } from "@/features/catalog/product-grid";
import { CategoryGrid, type CategoryTile } from "@/features/home/category-grid";
import { Collections } from "@/features/home/collections";
import { CtaBand } from "@/features/home/cta-band";
import { Hero } from "@/features/home/hero";
import { TrustBar } from "@/features/home/trust-bar";

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    catalog.listProducts(),
    catalog.listCategories(),
  ]);
  const byId = (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) throw new Error(`Producto ${id} no existe en el catálogo`);
    return product;
  };

  const [face, body] = curation.home.collage.small.map(byId) as [
    (typeof products)[number],
    (typeof products)[number],
  ];
  const newArrivals = curation.home.newArrivals.map(byId);
  const trending = curation.home.trending.map(byId);

  const count = (key: string) => products.filter((p) => p.category === key).length;
  const poloCount = products.filter((p) => p.polo).length;
  const tiles: CategoryTile[] = categories.map((c) => ({
    icon: c.key,
    label: c.label,
    href: categoryPath(c.key),
    countLabel: plural(count(c.key), "producto", "productos"),
  }));
  // La Colección Polo va como sexta tarjeta, igual que en el diseño.
  tiles.splice(5, 0, {
    icon: "polo",
    label: "Colección Polo",
    href: "/coleccion-polo",
    countLabel: plural(poloCount, "prenda", "prendas"),
  });

  const medicube = byId("f03");
  const olly = byId("s07");

  return (
    <>
      <Hero main={editorial.heroMain} face={face} body={body} />

      <section className="wrap sec-sm" aria-labelledby="cat-t">
        <SectionHead
          eyebrow="Explora por categoría"
          title="Todo lo que pedimos por ti"
          titleId="cat-t"
          action={<SectionLink href="/catalogo">Ver catálogo completo</SectionLink>}
        />
        <CategoryGrid tiles={tiles} />
      </section>

      <section className="wrap sec-sm" aria-labelledby="new-t">
        <SectionHead
          eyebrow="Nuevo en el catálogo"
          title="Recién llegados"
          titleId="new-t"
          action={<SectionLink href="/catalogo?destacado=nuevo">Ver todo lo nuevo</SectionLink>}
        />
        <ProductGrid products={newArrivals} />
      </section>

      <section className="bg-mist" aria-labelledby="tr-t">
        <div className="wrap sec">
          <SectionHead
            eyebrow="Lo que más se está pidiendo"
            title="Tendencias de la semana"
            titleId="tr-t"
            action={<SectionLink href="/tendencias">Ir a Tendencias</SectionLink>}
          />
          <ProductGrid products={trending} />
        </div>
      </section>

      <section className="wrap sec" aria-labelledby="col-t">
        <SectionHead
          eyebrow="Colecciones destacadas"
          title="Selecciones para comprar con calma"
          titleId="col-t"
        />
        <Collections
          main={{ href: "/coleccion-polo", image: editorial.poloCollection }}
          side={[
            {
              href: `${categoryPath("face")}?marca=Medicube`,
              image: medicube.images[0]!,
              eyebrow: "Cuidado facial",
              title: "Línea Medicube",
              text: "Sérum, crema y contornos de ojos de la línea PDRN y Kojic Acid.",
              cta: `Ver ${products.filter((p) => p.brand === "Medicube").length} productos`,
            },
            {
              href: categoryPath("health"),
              image: olly.images[0]!,
              eyebrow: "Salud y bienestar",
              title: "Vitaminas y suplementos",
              text: "Olly, Nature Made, Centrum y más marcas de farmacia de EE. UU.",
              note: "Consulta previa de viabilidad de importación.",
            },
          ]}
        />
      </section>

      <section className="bg-navy text-ivory" aria-labelledby="how-t">
        <div className="wrap sec">
          <SectionHead
            eyebrow="Cómo funciona"
            title="Tu pedido en cuatro pasos"
            titleId="how-t"
            onDark
            action={
              <SectionLink href="/como-funciona#preguntas" onDark>
                Preguntas frecuentes
              </SectionLink>
            }
          />
          <Steps steps={howItWorksSteps} onDark />
        </div>
      </section>

      <TrustBar />

      <CtaBand />
    </>
  );
}
