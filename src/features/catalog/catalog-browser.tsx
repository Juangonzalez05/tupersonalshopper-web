"use client";

import Link from "next/link";
import { useQueryStates } from "nuqs";
import { useId, useMemo, useState } from "react";
import {
  PAGE_SIZE,
  PRICE_FILTER_LABELS,
  SORT_KEYS,
  SORT_LABELS,
  catalogFacets,
  queryCatalog,
  type SortKey,
} from "@/domain/catalog-query";
import {
  CATEGORY_INFO,
  CATEGORY_KEYS,
  TAG_LABELS,
  categoryPath,
  type CategoryKey,
  type Product,
  type ProductTag,
} from "@/domain/product";
import { Button, buttonVariants } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { HealthNote } from "@/components/ui/status";
import { FiltersIcon, SearchIcon, SmallCloseIcon } from "@/components/icons/icons";
import { cn } from "@/lib/cn";
import { catalogParsers, serializeCatalogParams } from "./catalog-params";
import { FilterGroup, FilterLink, FilterOption } from "./filter-option";
import { ProductCard } from "./product-card";

export const catalogGridClass =
  "m-0 grid list-none grid-cols-2 gap-x-3.5 gap-y-8 p-0 md:grid-cols-3 md:gap-x-6 md:gap-y-10 min-[1360px]:grid-cols-4";

/**
 * Catálogo filtrable. La categoría viene de la ruta (/catalogo/[categoria]); el resto de
 * filtros vive en la URL para que se pueda compartir y volver atrás.
 */
export function CatalogBrowser({
  products,
  category,
}: {
  products: Product[];
  category?: CategoryKey;
}) {
  const [params, setParams] = useQueryStates(catalogParsers, { history: "replace", scroll: false });
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchId = useId();
  const sortId = useId();

  const query = {
    category,
    q: params.q,
    brand: params.marca || undefined,
    sub: params.sub || undefined,
    tags: params.destacado,
    price: params.valor ?? undefined,
    sort: params.orden,
  };
  const results = useMemo(
    () => queryCatalog(products, query),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      products,
      category,
      params.q,
      params.marca,
      params.sub,
      params.destacado,
      params.valor,
      params.orden,
    ],
  );
  const facets = useMemo(() => catalogFacets(products, category), [products, category]);
  const visible = results.slice(0, limit);

  /** Cambia filtros y vuelve a la primera página de resultados. */
  const update = (patch: Partial<typeof params>) => {
    setLimit(PAGE_SIZE);
    void setParams(patch);
  };

  // Al cambiar de categoría se conservan búsqueda, destacados, valor y orden (no marca ni sub).
  const categoryHref = (key: CategoryKey | undefined) =>
    (key ? categoryPath(key) : "/catalogo") +
    serializeCatalogParams({
      q: params.q,
      destacado: params.destacado,
      valor: params.valor,
      orden: params.orden,
    });

  const toggleTag = (tag: ProductTag) =>
    update({
      destacado: params.destacado.includes(tag)
        ? params.destacado.filter((t) => t !== tag)
        : [...params.destacado, tag],
    });

  const chips: { label: string; remove: () => void; href?: string }[] = [];
  if (category)
    chips.push({
      label: CATEGORY_INFO[category].label,
      remove: () => {},
      href: categoryHref(undefined),
    });
  if (params.sub) chips.push({ label: params.sub, remove: () => update({ sub: "" }) });
  if (params.marca) chips.push({ label: params.marca, remove: () => update({ marca: "" }) });
  for (const tag of params.destacado)
    chips.push({ label: TAG_LABELS[tag], remove: () => toggleTag(tag) });
  if (params.valor)
    chips.push({ label: PRICE_FILTER_LABELS[params.valor], remove: () => update({ valor: null }) });
  if (params.q) chips.push({ label: `“${params.q}”`, remove: () => update({ q: "" }) });

  const countInCategory = (key: CategoryKey) => products.filter((p) => p.category === key).length;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5 md:gap-4">
        <label
          id="buscar"
          htmlFor={searchId}
          className="flex h-[52px] flex-[1_1_100%] items-center gap-3 border border-line-2 bg-white px-4 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-gold lg:max-w-[560px] lg:flex-1"
        >
          <SearchIcon className="size-5 flex-none text-muted" />
          <span className="sr-only">Buscar productos</span>
          <input
            id={searchId}
            type="search"
            value={params.q}
            onChange={(event) => update({ q: event.target.value })}
            placeholder="Busca por producto o marca: Medicube, eos, polo…"
            className="h-full min-w-0 flex-1 border-0 bg-transparent font-sans text-[15px] text-ink outline-0"
            enterKeyHint="search"
          />
        </label>
        <Button
          variant="line"
          size="sm"
          className="flex-1 lg:hidden"
          aria-expanded={filtersOpen}
          aria-controls="filtros"
          onClick={() => setFiltersOpen((open) => !open)}
        >
          <FiltersIcon />
          Filtros {chips.length ? `(${chips.length})` : ""}
        </Button>
        <div className="flex items-center gap-2.5 text-[13px] text-muted">
          <label htmlFor={sortId}>Ordenar</label>
          <select
            id={sortId}
            value={params.orden}
            onChange={(event) => void setParams({ orden: event.target.value as SortKey })}
            className="h-11 border border-line-2 bg-white px-3 font-sans text-[13px] text-ink"
          >
            {SORT_KEYS.map((key) => (
              <option key={key} value={key}>
                {SORT_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-12">
        <aside
          id="filtros"
          aria-label="Filtros"
          className={cn("mb-6 flex-col lg:mb-0 lg:flex", filtersOpen ? "flex" : "hidden")}
        >
          <FilterGroup title="Categoría" first>
            <FilterLink
              on={!category}
              label="Todas las categorías"
              count={products.length}
              href={categoryHref(undefined)}
            />
            {CATEGORY_KEYS.map((key) => (
              <FilterLink
                key={key}
                on={category === key}
                label={CATEGORY_INFO[key].label}
                count={countInCategory(key)}
                href={categoryHref(key)}
              />
            ))}
          </FilterGroup>

          {category && facets.subcategories.length > 1 ? (
            <FilterGroup title="Subcategoría">
              <div className="flex flex-wrap gap-2">
                {facets.subcategories.map((sub) => (
                  <Chip
                    key={sub.value}
                    pressed={params.sub === sub.value}
                    aria-pressed={params.sub === sub.value}
                    onClick={() => update({ sub: params.sub === sub.value ? "" : sub.value })}
                  >
                    {sub.label}
                  </Chip>
                ))}
              </div>
            </FilterGroup>
          ) : null}

          <FilterGroup title="Marca">
            {facets.brands.map((brand) => (
              <FilterOption
                key={brand.value}
                on={params.marca === brand.value}
                label={brand.label}
                count={brand.count}
                onClick={() => update({ marca: params.marca === brand.value ? "" : brand.value })}
              />
            ))}
          </FilterGroup>

          <FilterGroup title="Destacados">
            <div className="flex flex-wrap gap-2">
              {(["nuevo", "tendencia"] as const).map((tag) => (
                <Chip
                  key={tag}
                  pressed={params.destacado.includes(tag)}
                  aria-pressed={params.destacado.includes(tag)}
                  onClick={() => toggleTag(tag)}
                >
                  {TAG_LABELS[tag]}
                </Chip>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Valor inicial">
            {facets.prices.map((price) => {
              const on = (params.valor ?? "all") === price.value;
              return (
                <FilterOption
                  key={price.value}
                  on={on}
                  label={price.label}
                  count={price.count}
                  onClick={() => update({ valor: price.value === "all" ? null : price.value })}
                />
              );
            })}
            <p className="mt-3 mb-0 type-small text-muted">
              Solo algunos productos traen valor inicial. El resto se cotiza contigo.
            </p>
          </FilterGroup>

          <div className="border-t border-line py-5">
            {category ? (
              <Link
                href="/catalogo"
                className={buttonVariants({ variant: "ghost" })}
                scroll={false}
              >
                Limpiar filtros
              </Link>
            ) : (
              <Button
                variant="ghost"
                onClick={() => update({ q: "", marca: "", sub: "", destacado: [], valor: null })}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </aside>

        <section aria-labelledby="resultados">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p id="resultados" aria-live="polite" className="m-0 text-sm">
              <b>{results.length}</b> {results.length === 1 ? "producto" : "productos"} · mostrando{" "}
              {visible.length}
            </p>
            {chips.length ? (
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0" aria-label="Filtros activos">
                {chips.map((chip) => (
                  <li key={chip.label}>
                    {chip.href ? (
                      <Link
                        href={chip.href}
                        scroll={false}
                        aria-label={`Quitar filtro ${chip.label}`}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-navy bg-navy px-4 text-[13px] text-ivory no-underline"
                      >
                        {chip.label}
                        <SmallCloseIcon className="size-3.5" />
                      </Link>
                    ) : (
                      <Chip
                        pressed
                        onClick={chip.remove}
                        aria-label={`Quitar filtro ${chip.label}`}
                      >
                        {chip.label}
                        <SmallCloseIcon />
                      </Chip>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {category === "health" ? (
            <HealthNote className="mb-6 border-t-0 pt-0 text-[13px]">
              Vitaminas, suplementos y medicamentos de venta libre requieren consulta previa de
              viabilidad de importación. No ofrecemos recomendaciones médicas; consulta a tu
              profesional de salud.
            </HealthNote>
          ) : null}

          {visible.length ? (
            <ul className={catalogGridClass}>
              {visible.map((product) => (
                <li key={product.id} className="min-w-0">
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-3.5 border border-line bg-white p-6 text-center md:p-8">
              <h2 className="type-h3">No encontramos ese producto en el catálogo</h2>
              <p className="m-0 max-w-[46ch] type-small text-muted">
                Pídelo como encargo: pega el enlace de la tienda y te lo cotizamos.
              </p>
              <Link href="/encargos" className={buttonVariants({ variant: "gold" })}>
                Hacer un encargo
              </Link>
            </div>
          )}

          {results.length > visible.length ? (
            <div className="flex flex-col items-center gap-3 pt-14">
              <p className="m-0 type-small text-muted">
                Has visto {visible.length} de {results.length} productos
              </p>
              <Button variant="line" onClick={() => setLimit((n) => n + PAGE_SIZE)}>
                Ver más productos
              </Button>
            </div>
          ) : null}
        </section>
      </div>
    </>
  );
}

/** Lo que se ve antes de leer la URL (prerender): la primera página sin filtros. */
export function CatalogFallback({ products }: { products: Product[] }) {
  return (
    <>
      <div className="mb-8 border-b border-line pb-5">
        <div className="h-[52px] w-full max-w-[560px] skeleton" />
      </div>
      <p className="mb-6 text-sm">
        <b>{products.length}</b> productos
      </p>
      <ul className={catalogGridClass}>
        {products.slice(0, PAGE_SIZE).map((product) => (
          <li key={product.id} className="min-w-0">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </>
  );
}
