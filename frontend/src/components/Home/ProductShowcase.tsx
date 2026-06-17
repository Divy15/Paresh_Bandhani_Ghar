import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import MotionReveal from "../CommonComponent/MotionReveal";

interface Product {
  name: string;
  category: string;
  tag: string;
  price: string;
  pattern: CSSProperties;
}

const products: Product[] = [
  {
    name: "Royal Red Bandhani Saree",
    category: "New Arrival",
    tag: "Silk blend",
    price: "From Rs. 2,499",
    pattern: {
      backgroundColor: "#B8252E",
      backgroundImage:
        "radial-gradient(circle at 14px 14px, rgba(255,255,255,0.78) 0 2px, transparent 2.6px), linear-gradient(135deg, rgba(197,160,89,0.9), transparent 34%)",
      backgroundSize: "30px 30px, 100% 100%",
    },
  },
  {
    name: "Emerald Festive Dupatta",
    category: "Top Notch",
    tag: "Gota border",
    price: "From Rs. 899",
    pattern: {
      backgroundColor: "#063020",
      backgroundImage:
        "radial-gradient(circle at 12px 12px, rgba(245,242,235,0.72) 0 1.8px, transparent 2.4px), linear-gradient(45deg, rgba(197,160,89,0.82), transparent 24%, rgba(184,37,46,0.58) 72%)",
      backgroundSize: "26px 26px, 100% 100%",
    },
  },
  {
    name: "Mustard Bandhej Dress Material",
    category: "New Arrival",
    tag: "Cotton set",
    price: "From Rs. 1,299",
    pattern: {
      backgroundColor: "#C5A059",
      backgroundImage:
        "radial-gradient(circle at 16px 16px, rgba(26,26,26,0.52) 0 1.8px, transparent 2.4px), linear-gradient(135deg, rgba(184,37,46,0.76), transparent 35%, rgba(6,48,32,0.72))",
      backgroundSize: "32px 32px, 100% 100%",
    },
  },
  {
    name: "Ivory Wedding Bandhani Set",
    category: "Top Notch",
    tag: "Premium edit",
    price: "From Rs. 3,799",
    pattern: {
      backgroundColor: "#F5F2EB",
      backgroundImage:
        "radial-gradient(circle at 13px 13px, rgba(184,37,46,0.72) 0 1.7px, transparent 2.4px), linear-gradient(120deg, rgba(197,160,89,0.75), transparent 28%, rgba(6,48,32,0.38))",
      backgroundSize: "28px 28px, 100% 100%",
    },
  },
];

export default function ProductShowcase() {
  return (
    <section className="bg-bg-main px-4 py-14 sm:px-6 lg:px-8 w-full">
      <div className="mx-auto max-w-7xl">
        <MotionReveal
          className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"
          direction="up"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-red">
              Fresh Collection
            </p>
            <h2 className="mt-2 text-4xl font-bold text-text-main sm:text-5xl">
              Newly arrived and top picks
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-text-muted">
            Product visuals are built as textile-inspired placeholders for now.
            Replace each pattern with real saree, dress, and dupatta photos when
            the client catalog is ready.
          </p>
        </MotionReveal>

        {/* Fixed Grid configuration to prevent cards getting trapped by viewport cut-offs */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full pb-8">
          {products.map((product, index) => (
            <motion.article
              key={product.name}
              className="group border border-border-main bg-bg-main flex flex-col flex-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.05 }} // Changed from 0.2 to 0.05 so mobile animation triggers immediately upon clipping the screen entry line
              transition={{ delay: index * 0.05, duration: 0.45 }}
              whileHover={{ y: -6 }}
            >
              <div className="relative aspect-[4/5] bg-border-main/10">
                <div
                  className="h-full w-full transition duration-500 group-hover:scale-105"
                  style={product.pattern}
                />
                <div className="absolute left-3 top-3 bg-bg-main/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-red backdrop-blur">
                  {product.category}
                </div>
              </div>

              <div className="p-4 flex flex-col flex-grow justify-between">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-xl md:text-2xl font-semibold leading-7 text-text-main break-words">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-text-muted">
                      {product.tag}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="grid h-9 w-9 shrink-0 place-items-center border border-border-main text-text-main transition group-hover:border-brand-red group-hover:text-brand-red bg-bg-main"
                    aria-label={`View ${product.name}`}
                  >
                    <ArrowUpRight size={16} />
                  </button>
                </div>
                <p className="text-sm font-semibold text-brand-green mt-auto">
                  {product.price}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}