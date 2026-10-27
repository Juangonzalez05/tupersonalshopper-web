/** Minúsculas y sin tildes, para búsquedas tolerantes ("serum" encuentra "Sérum"). */
export function normalizeText(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

export function slugify(value: string): string {
  return normalizeText(value)
    .replace(/&/g, " y ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
