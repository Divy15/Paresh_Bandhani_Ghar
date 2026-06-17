import axios from "axios";
import type { Category, Subcategory } from "../types/category";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat_1",
    name: "Saree",
    slug: "saree",
    url: "https://placehold.co/112x112?text=S",
    subcategories: [
      {
        id: "sub_1",
        name: "Cotton Saree",
        slug: "cotton-saree",
        url: "https://placehold.co/112x112?text=CS",
      },
      {
        id: "sub_2",
        name: "Jacquard Saree",
        slug: "jacquard-saree",
        url: "https://placehold.co/112x112?text=JS",
      },
      {
        id: "sub_3",
        name: "Gajji Silk",
        slug: "gajji-silk",
        url: "https://placehold.co/112x112?text=GS",
      },
      {
        id: "sub_1",
        name: "Cotton Saree",
        slug: "cotton-saree",
        url: "https://placehold.co/112x112?text=CS",
      },
      {
        id: "sub_2",
        name: "Jacquard Saree",
        slug: "jacquard-saree",
        url: "https://placehold.co/112x112?text=JS",
      },
      {
        id: "sub_3",
        name: "Gajji Silk",
        slug: "gajji-silk",
        url: "https://placehold.co/112x112?text=GS",
      },
      {
        id: "sub_1",
        name: "Cotton Saree",
        slug: "cotton-saree",
        url: "https://placehold.co/112x112?text=CS",
      },
      {
        id: "sub_2",
        name: "Jacquard Saree",
        slug: "jacquard-saree",
        url: "https://placehold.co/112x112?text=JS",
      },
      {
        id: "sub_3",
        name: "Gajji Silk",
        slug: "gajji-silk",
        url: "https://placehold.co/112x112?text=GS",
      },
    ],
  },
  {
    id: "cat_2",
    name: "Dress",
    slug: "dress",
    url: "https://placehold.co/112x112?text=D",
    subcategories: [
      {
        id: "sub_4",
        name: "Cotton Dress",
        slug: "cotton-dress",
        url: "https://placehold.co/112x112?text=CD",
      },
      {
        id: "sub_5",
        name: "Gajji Silk Dress",
        slug: "gajji-silk-dress",
        url: "https://placehold.co/112x112?text=GSD",
      },
    ],
  },
  {
    id: "cat_3",
    name: "Dupatta",
    slug: "dupatta",
    url: "https://placehold.co/112x112?text=Du",
    subcategories: [],
  },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeSubcategory(value: unknown): Subcategory | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== "string" || typeof value.name !== "string") {
    return null;
  }

  return {
    id: value.id,
    name: value.name,
    slug: typeof value.slug === "string" ? value.slug : value.id,
    url: typeof value.url === "string" ? value.url : undefined,
  };
}

function normalizeCategory(value: unknown): Category | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== "string" || typeof value.name !== "string") {
    return null;
  }

  const rawSubcategories = value.subcategories;
  const subcategories = Array.isArray(rawSubcategories)
    ? rawSubcategories
        .map(normalizeSubcategory)
        .filter((item): item is Subcategory => item !== null)
    : [];

  return {
    id: value.id,
    name: value.name,
    slug: typeof value.slug === "string" ? value.slug : value.id,
    url: typeof value.url === "string" ? value.url : undefined,
    subcategories,
  };
}

export function normalizeCategoriesResponse(payload: unknown): Category[] {
  if (Array.isArray(payload)) {
    return payload
      .map(normalizeCategory)
      .filter((item): item is Category => item !== null);
  }

  if (isRecord(payload)) {
    const nestedKeys = ["data", "categories", "result", "items"] as const;

    for (const key of nestedKeys) {
      if (key in payload) {
        return normalizeCategoriesResponse(payload[key]);
      }
    }
  }

  return [];
}

export async function fetchCategories(): Promise<Category[]> {
  const { data } = await axios.get<unknown>(`${API_BASE_URL}/categories`);
  const categories = normalizeCategoriesResponse(data);

  if (categories.length === 0) {
    throw new Error("Categories API did not return a valid category list.");
  }

  return categories;
}
