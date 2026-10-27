import { CATEGORY_INFO, CATEGORY_KEYS, type Category, type CategoryKey } from "@/domain/product";

const descriptions: Record<CategoryKey, string> = {
  beauty:
    "Gloss, sets de labios, perfumes, brochas y cosmetiqueras que compramos en tiendas de Estados Unidos.",
  face: "Sérums, cremas y contornos de ojos de marcas como Medicube.",
  body: "Cremas corporales, geles de baño, bálsamos labiales, cuidado oral y antibacteriales de marcas como eos, Vaseline y Carmex.",
  health:
    "Vitaminas, suplementos y productos de venta libre de farmacias de EE. UU., con consulta previa de viabilidad de importación.",
  fashion: "La Colección Polo para hombre y niños, gorras y ropa interior.",
  home: "Productos para la casa y la cocina.",
  snack: "Bebidas, snacks y ediciones especiales de Estados Unidos.",
};

export const categories: Category[] = CATEGORY_KEYS.map((key) => ({
  key,
  ...CATEGORY_INFO[key],
  description: descriptions[key],
}));

export const categoryByKey = Object.fromEntries(categories.map((c) => [c.key, c])) as Record<
  CategoryKey,
  Category
>;
