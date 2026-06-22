import React, { createContext, useContext, useMemo, useState } from "react";
import type { CatalogFilter } from "../types/category";

interface CatalogFilterContextType {
  filter: CatalogFilter;
  setCategoryFilter: (categoryId: string, subcategoryId?: string | null) => void;
  clearFilter: () => void;
}

const EMPTY_FILTER: CatalogFilter = {
  categoryId: null,
  subcategoryId: null,
};

const CatalogFilterContext = createContext<CatalogFilterContextType | undefined>(
  undefined
);

export const CatalogFilterProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [filter, setFilter] = useState<CatalogFilter>(EMPTY_FILTER);

  const value = useMemo(
    () => ({
      filter,
      setCategoryFilter: (
        categoryId: string,
        subcategoryId: string | null = null
      ) => {
        setFilter({ categoryId, subcategoryId });
      },
      clearFilter: () => setFilter(EMPTY_FILTER),
    }),
    [filter]
  );

  return (
    <CatalogFilterContext.Provider value={value}>
      {children}
    </CatalogFilterContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCatalogFilter = (): CatalogFilterContextType => {
  const context = useContext(CatalogFilterContext);
  if (!context) {
    throw new Error("useCatalogFilter must be used within CatalogFilterProvider");
  }
  return context;
};
