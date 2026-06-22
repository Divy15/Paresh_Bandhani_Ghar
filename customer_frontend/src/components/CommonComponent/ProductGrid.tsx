import React, { useEffect, useState, useRef, useCallback } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import type { Product } from "../../api/products";
import { fetchProductsApi } from "../../api/products";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  categoryId: string | null;
  subcategoryId: string | null;
  onProductClick?: (productId: string) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  categoryId,
  subcategoryId,
  onProductClick,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load first page or reset when filters change
  const loadInitialProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchProductsApi(1, 20, categoryId, subcategoryId);
      setProducts(result.products);
      setHasMore(result.hasMore);
      setPage(1);
    } catch (err) {
      console.error("Failed to load products:", err);
      setError("We encountered an issue loading products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [categoryId, subcategoryId]);

  useEffect(() => {
    loadInitialProducts();
  }, [loadInitialProducts]);

  // Load next pages
  const loadNextProducts = useCallback(async (nextPage: number) => {
    if (isFetchingNext || !hasMore) return;
    setIsFetchingNext(true);
    try {
      const result = await fetchProductsApi(nextPage, 20, categoryId, subcategoryId);
      
      // Avoid duplicate keys by filtering existing IDs
      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const uniqueNext = result.products.filter((p) => !existingIds.has(p.id));
        return [...prev, ...uniqueNext];
      });
      
      setHasMore(result.hasMore);
    } catch (err) {
      console.error("Failed to fetch next products page:", err);
    } finally {
      setIsFetchingNext(false);
    }
  }, [categoryId, subcategoryId, isFetchingNext, hasMore]);

  // Trigger next page load when page index state increments
  useEffect(() => {
    if (page > 1) {
      loadNextProducts(page);
    }
  }, [page, loadNextProducts]);

  // Setup IntersectionObserver on the 16th card of current list (index length - 5)
  const observer = useRef<IntersectionObserver | null>(null);
  const triggerCardRef = useCallback(
    (node: HTMLElement | null) => {
      if (isLoading || isFetchingNext) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prev) => prev + 1);
          }
        },
        { rootMargin: "200px" } // trigger load slightly before it scrolls fully into view
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, isFetchingNext, hasMore]
  );

  // Skeleton Card Loader
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={`skeleton-${idx}`}
          className="border border-border-main bg-bg-main p-4 flex flex-col h-[400px] animate-pulse"
        >
          <div className="aspect-[4/5] bg-border-main/20 rounded-sm mb-4 w-full" />
          <div className="h-4 bg-border-main/20 rounded-md w-3/4 mb-2" />
          <div className="h-3 bg-border-main/20 rounded-md w-1/2 mb-4" />
          <div className="mt-auto flex justify-between items-center">
            <div className="h-5 bg-border-main/20 rounded-md w-1/3" />
            <div className="h-8 bg-border-main/20 rounded-md w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4 font-body">
        <p className="text-text-muted mb-4">{error}</p>
        <button
          type="button"
          onClick={loadInitialProducts}
          className="inline-flex items-center gap-2 bg-brand-red px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-brand-red/90 transition shadow-xs cursor-pointer"
        >
          <RefreshCw size={14} />
          Retry loading
        </button>
      </div>
    );
  }

  if (isLoading && products.length === 0) {
    return renderSkeletons();
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4 font-body">
        <p className="text-text-muted text-base mb-2">No matching products found.</p>
        <p className="text-xs text-text-muted/70 max-w-sm">
          Try choosing another category from the catalog bar or resetting filters.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Product Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full pb-10">
        {products.map((product, index) => {
          // Identify the 16th card in the newest batch (5th from end of the list)
          const isTriggerNode = index === products.length - 5;
          return (
            <div
              key={product.id}
              ref={isTriggerNode ? triggerCardRef : undefined}
              className="h-full w-full"
            >
              <ProductCard product={product} onProductClick={onProductClick} />
            </div>
          );
        })}
      </div>

      {/* Loading indicator for subsequent pages */}
      {isFetchingNext && (
        <div className="flex items-center justify-center gap-2.5 py-8 text-sm text-brand-yellow font-body">
          <Loader2 className="animate-spin" size={18} />
          <span className="tracking-widest uppercase text-xs font-medium">
            Fetching next bandhani masterpieces...
          </span>
        </div>
      )}

      {/* End of results indicator */}
      {!hasMore && products.length > 0 && (
        <div className="text-center py-12 border-t border-border-main/20 mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-text-muted/65 font-body">
          ✨ You have viewed all of our heritage collections.
        </div>
      )}
    </div>
  );
};
