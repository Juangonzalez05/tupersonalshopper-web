import { createSerializer, parseAsArrayOf, parseAsString, parseAsStringLiteral } from "nuqs";
import { PRICE_FILTERS, SORT_KEYS } from "@/domain/catalog-query";

/** Parámetros de URL del catálogo (?q=&marca=&sub=&destacado=&valor=&orden=). */
export const catalogParsers = {
  q: parseAsString.withDefault(""),
  marca: parseAsString.withDefault(""),
  sub: parseAsString.withDefault(""),
  destacado: parseAsArrayOf(parseAsStringLiteral(["nuevo", "tendencia"] as const)).withDefault([]),
  valor: parseAsStringLiteral(PRICE_FILTERS),
  orden: parseAsStringLiteral(SORT_KEYS).withDefault("rec"),
};

export const serializeCatalogParams = createSerializer(catalogParsers);
