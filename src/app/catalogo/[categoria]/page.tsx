import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalog } from "@/data";
import { CatalogPage } from "@/features/catalog/catalog-page";

/** Igual que en /producto: una categoría inexistente debe responder 404. */
export const instant = false;

export async function generateStaticParams() {
  const categories = await catalog.listCategories();
  return categories.map((category) => ({ categoria: category.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/catalogo/[categoria]">): Promise<Metadata> {
  const { categoria } = await params;
  const category = await catalog.getCategoryBySlug(categoria);
  if (!category) return {};
  return {
    title: `${category.label} · Catálogo`,
    description: category.description,
    alternates: { canonical: `/catalogo/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps<"/catalogo/[categoria]">) {
  const { categoria } = await params;
  const category = await catalog.getCategoryBySlug(categoria);
  if (!category) notFound();
  return <CatalogPage category={category} />;
}
