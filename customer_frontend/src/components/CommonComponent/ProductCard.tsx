import React from "react";
import { Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import type { Product } from "../../api/products";
import { useStore } from "../../context/StoreContext";
import { ProductImageCarousel } from "./ProductImageCarousel";

interface ProductCardProps {
  product: Product;
  onProductClick?: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onProductClick,
}) => {
  const { toggleLike, isLiked, addToBag } = useStore();
  const liked = isLiked(product.id);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    toggleLike(product.id);

    if (!liked) {
      toast.success(`Added ${product.name} to wishlist!`, { icon: "❤️" });
    } else {
      toast.success(`Removed ${product.name} from wishlist.`);
    }
  };

  const handleAddToBag = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToBag(product.id);
    toast.success(`Added ${product.name} to bag!`, { icon: "🛍️" });
  };

  const handleCardClick = () => {
    onProductClick?.(product.id);
  };

  return (
    <motion.article
      className="group relative border border-border-main bg-bg-main flex flex-col w-full h-full overflow-hidden shadow-xs hover:shadow-md transition-shadow duration-300"
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="relative aspect-[4/5] bg-border-main/5 w-full cursor-pointer"
        onClick={handleCardClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && handleCardClick()}
        aria-label={`View details for ${product.name}`}
      >
        <ProductImageCarousel
          images={product.images}
          patterns={product.patterns}
          name={product.name}
        />

        <div className="absolute left-3 top-3 z-20 flex flex-col gap-1.5 pointer-events-none">
          <span className="bg-bg-main/90 border border-border-main/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-red backdrop-blur-xs shadow-xs">
            {product.category === "cat_1" ? "Saree" : product.category === "cat_2" ? "Dress" : "Dupatta"}
          </span>
          <span className="bg-brand-yellow/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-white shadow-xs w-max">
            {product.tag}
          </span>
        </div>

        <button
          type="button"
          onClick={handleLikeClick}
          className="absolute right-3 top-3 z-20 flex h-9.5 w-9.5 items-center justify-center rounded-full bg-bg-main/80 border border-border-main/60 text-text-main backdrop-blur-xs shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <motion.div
            animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              size={18}
              className={`transition-colors ${
                liked ? "fill-brand-red text-brand-red" : "text-text-muted hover:text-brand-red"
              }`}
            />
          </motion.div>
        </button>
      </div>

      <div
        className="p-4 flex flex-col flex-grow justify-between gap-3 cursor-pointer"
        onClick={handleCardClick}
        role="presentation"
      >
        <div className="min-w-0">
          <h3 className="text-lg font-header font-bold leading-tight text-text-main group-hover:text-brand-red transition-colors line-clamp-2">
            {product.name}
          </h3>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-text-muted font-body">
            ID: {product.id}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2 border-t border-border-main/30">
          <div className="flex flex-col">
            <span className="text-[10px] text-text-muted font-body uppercase tracking-[0.08em]">Price</span>
            <span className="text-base font-bold text-brand-green leading-none">
              {product.price}
            </span>
          </div>

          <motion.button
            type="button"
            onClick={handleAddToBag}
            className="flex items-center gap-1.5 bg-brand-red px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-brand-red/90 transition-colors shadow-xs hover:shadow-sm cursor-pointer"
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingBag size={13} />
            Add to Bag
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};
