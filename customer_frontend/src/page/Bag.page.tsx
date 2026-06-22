import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  Package,
  Truck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useStore } from "../context/StoreContext";
import { getProductById } from "../api/products";
import MotionReveal from "../components/CommonComponent/MotionReveal";

const FREE_SHIPPING_THRESHOLD = 3000;
const SHIPPING_CHARGE = 99;

interface BagPageProps {
  onExplore: () => void;
}

function generateTrackingNumber() {
  return `PBG${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function getEstimatedDelivery() {
  const date = new Date();
  date.setDate(date.getDate() + 7 + Math.floor(Math.random() * 2));
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BagPage({ onExplore }: BagPageProps) {
  const { bag, removeFromBag, updateBagQuantity, clearBag } = useStore();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  const bagItems = bag
    .map((item) => {
      const product = getProductById(item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const subtotal = bagItems.reduce(
    (sum, item) => sum + item.product.rawPrice * item.quantity,
    0
  );
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    setTrackingNumber(generateTrackingNumber());
    setDeliveryDate(getEstimatedDelivery());
    setOrderPlaced(true);
    toast.success("Order placed successfully!", { icon: "🎉" });
  };

  const handleContinueShopping = () => {
    clearBag();
    setOrderPlaced(false);
    onExplore();
  };

  if (bagItems.length === 0 && !orderPlaced) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center font-body">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-brand-yellow/40 bg-brand-yellow/5"
        >
          <ShoppingBag size={40} className="text-brand-yellow/70" />
        </motion.div>
        <h2 className="font-header text-3xl font-bold text-text-main">
          Your Bag is Empty
        </h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-text-muted">
          Discover our heritage Bandhani collections and add your favourites to the bag.
        </p>
        <motion.button
          type="button"
          onClick={onExplore}
          whileTap={{ scale: 0.97 }}
          className="mt-8 inline-flex items-center gap-2 bg-brand-red px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-sm hover:bg-brand-red/90 transition"
        >
          <Sparkles size={14} />
          Start Shopping
        </motion.button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 font-body min-h-[80vh]">
      <AnimatePresence mode="wait">
        {orderPlaced ? (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-auto max-w-lg text-center"
          >
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-green/10">
                <CheckCircle2 size={48} className="text-brand-green" />
              </div>
            </div>
            <h1 className="font-header text-4xl font-bold text-text-main">
              Order Confirmed!
            </h1>
            <p className="mt-3 text-sm text-text-muted">
              Thank you for choosing Paresh Bandhani Ghar. Your heritage pieces are on their way.
            </p>

            <div className="mt-8 rounded-xl border border-border-main bg-border-main/10 p-6 text-left space-y-4">
              <div className="flex items-center gap-3">
                <Package size={18} className="text-brand-red shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted">Tracking Number</p>
                  <p className="font-mono text-sm font-semibold text-text-main">{trackingNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Truck size={18} className="text-brand-yellow shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted">Estimated Delivery</p>
                  <p className="text-sm font-semibold text-text-main">{deliveryDate}</p>
                </div>
              </div>
              <div className="border-t border-border-main/40 pt-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted mb-2">Order Summary</p>
                {bagItems.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm py-1">
                    <span className="text-text-muted truncate mr-4">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span className="font-semibold text-text-main shrink-0">
                      Rs. {(item.product.rawPrice * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
                <div className="mt-3 flex justify-between border-t border-border-main/40 pt-3 font-bold text-brand-green">
                  <span>Total Paid</span>
                  <span>Rs. {total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleContinueShopping}
              whileTap={{ scale: 0.97 }}
              className="mt-8 inline-flex items-center gap-2 bg-brand-red px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white shadow-sm hover:bg-brand-red/90 transition"
            >
              Continue Shopping
            </motion.button>
          </motion.div>
        ) : (
          <motion.div key="bag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MotionReveal className="mb-8 border-b border-border-main/40 pb-6" direction="up">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-red">
                Shopping Bag
              </p>
              <h1 className="mt-2 font-header text-4xl font-bold text-text-main sm:text-5xl">
                Your Bag
              </h1>
              <p className="mt-2 text-sm text-text-muted">
                {bagItems.length} item{bagItems.length !== 1 ? "s" : ""} · Rs. {subtotal.toLocaleString("en-IN")} subtotal
              </p>
            </MotionReveal>

            <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
              <div className="space-y-4">
                {bagItems.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 border border-border-main bg-bg-main p-4 shadow-xs"
                  >
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden">
                      <div
                        className="absolute inset-0"
                        style={item.product.patterns[0]}
                      />
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="relative z-10 h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-header text-base font-bold text-text-main line-clamp-2">
                          {item.product.name}
                        </h3>
                        <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-text-muted">
                          {item.product.id}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1 border border-border-main">
                          <button
                            type="button"
                            onClick={() => updateBagQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="flex h-8 w-8 items-center justify-center text-text-muted hover:bg-border-main/30 disabled:opacity-40 transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateBagQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= 10}
                            className="flex h-8 w-8 items-center justify-center text-text-muted hover:bg-border-main/30 disabled:opacity-40 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <span className="font-bold text-brand-green">
                          Rs. {(item.product.rawPrice * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        removeFromBag(item.productId);
                        toast.success("Item removed from bag");
                      }}
                      className="shrink-0 self-start p-2 text-text-muted hover:text-brand-red transition"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="h-fit rounded-xl border border-border-main bg-border-main/10 p-6">
                <h2 className="font-header text-xl font-bold text-text-main mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Subtotal</span>
                    <span className="font-semibold">Rs. {subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Shipping</span>
                    <span className={`font-semibold ${shipping === 0 ? "text-brand-green" : ""}`}>
                      {shipping === 0 ? "Free" : `Rs. ${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-[11px] text-brand-yellow">
                      Add Rs. {(FREE_SHIPPING_THRESHOLD - subtotal).toLocaleString("en-IN")} more for free shipping
                    </p>
                  )}
                  <div className="flex justify-between border-t border-border-main/40 pt-3 text-base font-bold text-brand-green">
                    <span>Total</span>
                    <span>Rs. {total.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <motion.button
                  type="button"
                  onClick={handlePlaceOrder}
                  whileTap={{ scale: 0.97 }}
                  className="mt-6 w-full bg-brand-red py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white hover:bg-brand-red/90 transition shadow-sm"
                >
                  Place Order
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
