// import React from "react";
import { FilterX } from "lucide-react";
import { useCatalogFilter } from "../context/CatalogFilterContext";
import { useCategories } from "../context/CategoryContext";
import { getFilterLabel } from "../utils/categoryHelpers";
import { ProductGrid } from "../components/CommonComponent/ProductGrid";
import MotionReveal from "../components/CommonComponent/MotionReveal";

export default function ShoppingPage({
  onProductClick,
}: {
  onProductClick?: (productId: string) => void;
}) {
  const { filter, clearFilter } = useCatalogFilter();
  const { categories } = useCategories();
  const activeFilterLabel = getFilterLabel(categories, filter);

  const hasActiveFilter = !!(filter.categoryId || filter.subcategoryId);

  return (
    <div className="bg-bg-main px-4 py-10 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full min-h-[80vh] font-body">
      <MotionReveal
        className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-border-main/40 pb-6"
        direction="up"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-red">
            Exquisite Handloom
          </p>
          <h1 className="mt-2 text-4xl font-bold text-text-main sm:text-5xl font-header">
            {activeFilterLabel ? (
              <>
                Showing <span className="text-brand-yellow">{activeFilterLabel}</span>
              </>
            ) : (
              "All Heritage Collections"
            )}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-text-muted">
            Explore our vast catalog of hand-tied Gujarati Bandhani craft.
            Featuring authentic silk sarees, premium dresses, and designer dupattas.
          </p>
        </div>

        {hasActiveFilter && (
          <button
            type="button"
            onClick={clearFilter}
            className="inline-flex items-center gap-2 border border-brand-red/40 bg-brand-red/5 px-4.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-red hover:bg-brand-red hover:text-white transition shadow-xs cursor-pointer rounded-sm"
          >
            <FilterX size={14} />
            Clear Filter
          </button>
        )}
      </MotionReveal>

      {/* Paginated Infinite Scrolling Catalog Grid */}
      <ProductGrid
        categoryId={filter.categoryId}
        subcategoryId={filter.subcategoryId}
        onProductClick={onProductClick}
      />
    </div>
  );
}
