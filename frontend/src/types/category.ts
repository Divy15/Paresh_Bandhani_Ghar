export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  url?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  url?: string;
  subcategories: Subcategory[];
}

export interface CatalogFilter {
  categoryId: string | null;
  subcategoryId: string | null;
}

export interface CategorySearchSuggestion {
  id: string;
  label: string;
  value: string;
  imageUrl?: string;
  categoryId: string;
  subcategoryId?: string;
  type: "category" | "subcategory";
}
