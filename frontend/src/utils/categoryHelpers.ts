import type {
  CatalogFilter,
  Category,
  CategorySearchSuggestion,
  Subcategory,
} from "../types/category";

export function hasSubcategories(category: Category): boolean {
  return Array.isArray(category.subcategories) && category.subcategories.length > 0;
}

export function findCategoryById(
  categories: Category[],
  categoryId: string | null | undefined
): Category | undefined {
  if (!categoryId) return undefined;
  return categories.find((category) => category.id === categoryId);
}

export function findSubcategoryById(
  categories: Category[],
  subcategoryId: string | null | undefined
): { category: Category; subcategory: Subcategory } | undefined {
  if (!subcategoryId) return undefined;

  for (const category of categories) {
    const subcategory = category.subcategories.find(
      (item) => item.id === subcategoryId
    );
    if (subcategory) {
      return { category, subcategory };
    }
  }

  return undefined;
}

export function buildSearchSuggestions(
  categories: Category[]
): CategorySearchSuggestion[] {
  if (!Array.isArray(categories)) {
    return [];
  }

  return categories.flatMap((category) => {
    const subcategories = Array.isArray(category.subcategories)
      ? category.subcategories
      : [];
    const categorySuggestion: CategorySearchSuggestion = {
      id: category.id,
      label: category.name,
      value: category.slug,
      imageUrl: category.url,
      categoryId: category.id,
      type: "category",
    };

    const subcategorySuggestions = subcategories.map((subcategory) => ({
      id: subcategory.id,
      label: subcategory.name,
      value: subcategory.slug,
      imageUrl: subcategory.url ?? category.url,
      categoryId: category.id,
      subcategoryId: subcategory.id,
      type: "subcategory" as const,
    }));

    return [categorySuggestion, ...subcategorySuggestions];
  });
}

export function getFilterLabel(
  categories: Category[],
  filter: CatalogFilter
): string | null {
  if (filter.subcategoryId) {
    const match = findSubcategoryById(categories, filter.subcategoryId);
    return match?.subcategory.name ?? null;
  }

  if (filter.categoryId) {
    return findCategoryById(categories, filter.categoryId)?.name ?? null;
  }

  return null;
}
