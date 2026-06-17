import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchCategories, MOCK_CATEGORIES } from "../api/categories";
import type { Category } from "../types/category";
import { buildSearchSuggestions } from "../utils/categoryHelpers";

interface CategoryContextType {
  categories: Category[];
  searchSuggestions: ReturnType<typeof buildSearchSuggestions>;
  isLoading: boolean;
  error: string | null;
  refetchCategories: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (loadError) {
      console.error("Failed to load categories:", loadError);

      if (import.meta.env.DEV) {
        setCategories(MOCK_CATEGORIES);
        setError(null);
      } else {
        setError("Unable to load categories right now.");
        setCategories([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const searchSuggestions = useMemo(
    () => buildSearchSuggestions(categories),
    [categories]
  );

  return (
    <CategoryContext.Provider
      value={{
        categories,
        searchSuggestions,
        isLoading,
        error,
        refetchCategories: loadCategories,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCategories = (): CategoryContextType => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within CategoryProvider");
  }
  return context;
};
