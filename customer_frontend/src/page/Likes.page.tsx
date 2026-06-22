import { Heart, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "../context/StoreContext";
import { getProductById } from "../api/products";
import { ProductCard } from "../components/CommonComponent/ProductCard";
import MotionReveal from "../components/CommonComponent/MotionReveal";

interface LikesPageProps {
  onExplore: () => void;
  onProductClick: (productId: string) => void;
}

export default function LikesPage({ onExplore, onProductClick }: LikesPageProps) {
  const { likedIds } = useStore();
  const likedProducts = likedIds
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => p !== null);

  if (likedProducts.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center font-body">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-brand-red/30 bg-brand-red/5"
        >
          <Heart size={40} className="text-brand-red/60" />
        </motion.div>
        <h2 className="font-header text-3xl font-bold text-text-main">
          Your Wishlist is Empty
        </h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-text-muted">
          Save your favourite Bandhani pieces by tapping the heart icon on any product.
          They will appear here for easy access.
        </p>
        <motion.button
          type="button"
          onClick={onExplore}
          whileTap={{ scale: 0.97 }}
          className="mt-8 inline-flex items-center gap-2 bg-brand-red px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-sm hover:bg-brand-red/90 transition"
        >
          <Sparkles size={14} />
          Explore Collections
        </motion.button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 font-body min-h-[80vh]">
      <MotionReveal className="mb-8 border-b border-border-main/40 pb-6" direction="up">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-red">
          Saved Favourites
        </p>
        <h1 className="mt-2 font-header text-4xl font-bold text-text-main sm:text-5xl">
          My Wishlist
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          {likedProducts.length} treasured piece{likedProducts.length !== 1 ? "s" : ""} saved
        </p>
      </MotionReveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {likedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={{ ...product, isLiked: true }}
            onProductClick={onProductClick}
          />
        ))}
      </div>
    </div>
  );
}
