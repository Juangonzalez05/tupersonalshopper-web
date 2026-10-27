import "server-only";
import type { CatalogRepository } from "./catalog-repository";
import { staticCatalog } from "./static/static-catalog";

/** Repositorio activo. Para pasar a Supabase o un CMS, se cambia solo esta línea. */
export const catalog: CatalogRepository = staticCatalog;

export { curation, editorial } from "./static/curation";
export type { EditorialImage } from "./static/curation";
