import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Star,
  Truck,
  AlertTriangle,
  Camera,
  Send,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getProductById,
  getProductColorVariations,
  getSimilarProducts,
} from "../api/products";
import { useStore } from "../context/StoreContext";
import { useCategories } from "../context/CategoryContext";
import { ProductImageCarousel } from "../components/CommonComponent/ProductImageCarousel";
import { ProductCard } from "../components/CommonComponent/ProductCard";
import { Textarea } from "../components/CommonComponent/Textarea";
import MotionReveal from "../components/CommonComponent/MotionReveal";

interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  photoUrl?: string;
  date: string;
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "rev_1",
    author: "Priya Shah",
    rating: 5,
    text: "Absolutely stunning Bandhani work! The colours are vibrant and the fabric quality is premium. Delivered within 8 days to Ahmedabad.",
    photoUrl: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80",
    date: "12 Mar 2026",
  },
  {
    id: "rev_2",
    author: "Meera Patel",
    rating: 4,
    text: "Beautiful traditional design. Slightly lighter shade than photos but still gorgeous. Would recommend for festive occasions.",
    date: "28 Feb 2026",
  },
  {
    id: "rev_3",
    author: "Anjali Desai",
    rating: 5,
    text: "Third purchase from Paresh Bandhani Ghar. Consistent quality every time. The zari border detail is exquisite.",
    photoUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=200&q=80",
    date: "15 Feb 2026",
  },
];

interface ProductDetailsPageProps {
  productId: string;
  onBack: () => void;
  onProductClick: (productId: string) => void;
}

function StarRating({
  rating,
  interactive = false,
  onChange,
  size = 18,
}: {
  rating: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
        >
          <Star
            size={size}
            className={
              star <= Math.round(rating)
                ? "fill-brand-yellow text-brand-yellow"
                : "text-border-main"
            }
          />
        </button>
      ))}
    </div>
  );
}

export default function ProductDetailsPage({
  productId,
  onBack,
  onProductClick,
}: ProductDetailsPageProps) {
  const { toggleLike, isLiked, addToBag, setActiveProductId } = useStore();
  const { categories } = useCategories();

  const product = getProductById(productId);
  const colorVariations = product ? getProductColorVariations(product) : [];
  const similarProducts = product ? getSimilarProducts(product, 4) : [];

  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");
  const [newPhotoPreview, setNewPhotoPreview] = useState<string | null>(null);

  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const categoryName = useMemo(() => {
    if (!product) return "";
    const cat = categories.find((c) => c.id === product.category);
    return cat?.name ?? product.category;
  }, [product, categories]);

  if (!product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 font-body">
        <p className="text-text-muted mb-4">Product not found.</p>
        <button
          type="button"
          onClick={onBack}
          className="text-brand-red text-sm font-semibold uppercase tracking-widest hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  const liked = isLiked(product.id);

  const handleColorVariationClick = (variationId: string) => {
    setActiveProductId(variationId);
  };

  const handleAddToBag = () => {
    addToBag(product.id);
    toast.success(`Added ${product.name} to bag!`, { icon: "🛍️" });
  };

  const handleToggleLike = () => {
    toggleLike(product.id);
    toast.success(
      liked ? `Removed from wishlist` : `Added ${product.name} to wishlist!`,
      { icon: liked ? "💔" : "❤️" }
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setNewPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) {
      toast.error("Please write your feedback");
      return;
    }
    const review: Review = {
      id: `rev_${Date.now()}`,
      author: "You",
      rating: newRating,
      text: newText.trim(),
      photoUrl: newPhotoPreview ?? undefined,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
    setReviews((prev) => [review, ...prev]);
    setNewText("");
    setNewRating(5);
    setNewPhotoPreview(null);
    toast.success("Review submitted!");
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 font-body min-h-[80vh]">
      {/* Top Bar */}
      <div className="mb-6 flex items-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-text-muted hover:text-brand-red transition"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <span className="text-text-muted/40">|</span>
        <nav className="text-xs uppercase tracking-[0.14em] text-text-muted">
          <span className="hover:text-brand-red cursor-pointer" onClick={onBack}>
            Collections
          </span>
          <span className="mx-2">›</span>
          <span className="text-brand-yellow">{categoryName}</span>
        </nav>
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left: Image Gallery */}
        <MotionReveal direction="left">
          <ProductImageCarousel
            images={product.images}
            patterns={product.patterns}
            name={product.name}
            size="large"
            showThumbnails
          />
        </MotionReveal>

        {/* Right: Product Info */}
        <MotionReveal direction="right" className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-red">
              {categoryName}
            </p>
            <h1 className="mt-2 font-header text-3xl font-bold text-text-main sm:text-4xl leading-tight">
              {product.name}
            </h1>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-text-muted">
              ID: {product.id} · {product.tag}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <StarRating rating={avgRating} size={20} />
            <span className="text-sm font-semibold text-text-main">
              {avgRating.toFixed(1)} / 5
            </span>
            <span className="text-xs text-text-muted">
              ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
            </span>
          </div>

          <p className="text-3xl font-bold text-brand-green">{product.price}</p>

          <div className="flex flex-wrap gap-3">
            <motion.button
              type="button"
              onClick={handleAddToBag}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-brand-red px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-brand-red/90 transition shadow-sm"
            >
              <ShoppingBag size={16} />
              Add to Bag
            </motion.button>
            <motion.button
              type="button"
              onClick={handleToggleLike}
              whileTap={{ scale: 0.97 }}
              className={`inline-flex items-center gap-2 border px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition shadow-sm ${
                liked
                  ? "border-brand-red bg-brand-red/5 text-brand-red"
                  : "border-border-main text-text-main hover:border-brand-red/40"
              }`}
            >
              <Heart size={16} className={liked ? "fill-brand-red" : ""} />
              {liked ? "Wishlisted" : "Add to Wishlist"}
            </motion.button>
          </div>

          {/* Color Catalog */}
          {colorVariations.length > 0 && (
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                Color Variations
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="relative h-14 w-14 overflow-hidden rounded-md border-2 border-brand-red shadow-sm"
                  title={product.name}
                >
                  <div className="absolute inset-0" style={product.patterns[0]} />
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="relative z-10 h-full w-full object-cover"
                  />
                </button>
                {colorVariations.slice(0, 8).map((variation) => (
                  <button
                    type="button"
                    key={variation.id}
                    onClick={() => handleColorVariationClick(variation.id)}
                    className="relative h-14 w-14 overflow-hidden rounded-md border-2 border-border-main/60 hover:border-brand-red/40 transition"
                    title={variation.name}
                  >
                    <div className="absolute inset-0" style={variation.patterns[0]} />
                    <img
                      src={variation.images[0]}
                      alt={variation.name}
                      className="relative z-10 h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Policies Box */}
          <div className="rounded-xl border border-border-main bg-border-main/10 p-5 space-y-3">
            <div className="flex items-start gap-3">
              <Truck size={16} className="text-brand-yellow shrink-0 mt-0.5" />
              <p className="text-sm text-text-main">
                7 to 8 days delivery possible all over India
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Truck size={16} className="text-text-muted shrink-0 mt-0.5" />
              <p className="text-sm text-text-muted">
                Delivery charges differ by location
              </p>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle size={16} className="text-brand-red shrink-0 mt-0.5" />
              <p className="text-sm text-text-main">
                Non-Returnable (unless defective)
              </p>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle size={16} className="text-brand-red shrink-0 mt-0.5" />
              <p className="text-sm text-text-main">
                Non-Exchangeable
              </p>
            </div>
          </div>
        </MotionReveal>
      </div>

      {/* Reviews Section */}
      <section className="mt-16 border-t border-border-main/40 pt-12">
        <h2 className="font-header text-2xl font-bold text-text-main mb-8">
          Customer Reviews
        </h2>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="border border-border-main bg-bg-main p-5 shadow-xs"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-text-main">{review.author}</p>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-text-muted">
                      {review.date}
                    </p>
                  </div>
                  <StarRating rating={review.rating} size={14} />
                </div>
                <p className="mt-3 text-sm leading-6 text-text-muted">{review.text}</p>
                {review.photoUrl && (
                  <img
                    src={review.photoUrl}
                    alt="Review photo"
                    className="mt-3 h-24 w-24 rounded-md object-cover border border-border-main"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Write a Review Form */}
          <form
            onSubmit={handleSubmitReview}
            className="h-fit rounded-xl border border-border-main bg-border-main/10 p-6 space-y-4"
          >
            <h3 className="font-header text-lg font-bold text-text-main">
              Write a Review
            </h3>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                Your Rating
              </p>
              <StarRating
                rating={newRating}
                interactive
                onChange={setNewRating}
                size={24}
              />
            </div>

            <Textarea
              name="review"
              label="Your Feedback"
              placeholder="Share your experience with this product..."
              rows={4}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
            />

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
                Attach Photo (optional)
              </p>
              <label className="flex cursor-pointer items-center gap-3 rounded-md border border-dashed border-border-main px-4 py-3 text-sm text-text-muted hover:border-brand-red/40 transition">
                <Camera size={18} />
                {newPhotoPreview ? "Photo selected" : "Choose a photo"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
              {newPhotoPreview && (
                <img
                  src={newPhotoPreview}
                  alt="Preview"
                  className="mt-2 h-20 w-20 rounded-md object-cover border border-border-main"
                />
              )}
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-green py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:opacity-90 transition"
            >
              <Send size={14} />
              Submit Review
            </motion.button>
          </form>
        </div>
      </section>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="mt-16 border-t border-border-main/40 pt-12">
          <h2 className="font-header text-2xl font-bold text-text-main mb-8">
            Similar Products
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {similarProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onProductClick={onProductClick}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
