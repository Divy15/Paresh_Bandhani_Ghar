import { ArrowRight, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";
import MotionReveal from "../CommonComponent/MotionReveal";

interface HomeHeroProps {
  onShopNow: () => void;
}

export default function HomeHero({ onShopNow }: HomeHeroProps) {
  const { theme } = useTheme();

  return (
    <section className="relative overflow-hidden border-b border-border-main bg-bg-main">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-9 px-4 py-10 sm:px-6 md:py-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:px-8 lg:py-12 xl:min-h-[calc(100vh-92px)] xl:gap-12 xl:py-16">
        <MotionReveal className="max-w-3xl" direction="right">
          <motion.div
            className="mb-5 inline-flex items-center gap-2 border border-brand-yellow/40 bg-brand-yellow/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.28em] text-brand-yellow"
            whileHover={{ y: -2 }}
          >
            <Sparkles size={14} />
            Authentic Gujarati Craft
          </motion.div>

          <h1 className="max-w-4xl text-5xl font-bold leading-[0.95] text-text-main sm:text-6xl lg:text-7xl">
            Paresh Bandhani Ghar
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-text-muted sm:text-lg">
            Handpicked Bandhani sarees, dress materials, and dupattas crafted
            with rich dots, festive color, and heirloom finishing for weddings,
            gifting, and everyday elegance.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <motion.button
              type="button"
              onClick={onShopNow}
              className="inline-flex min-h-12 items-center justify-center gap-2 bg-brand-red px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-brand-red/90"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <ShoppingBag size={17} />
              Shop Collection
              <ArrowRight size={16} />
            </motion.button>
            <motion.div
              className="inline-flex min-h-12 items-center justify-center gap-2 border border-border-main px-5 py-3 text-sm font-medium text-text-main"
              whileHover={{ y: -3 }}
            >
              <ShieldCheck size={17} className="text-brand-green" />
              Trusted festive wear from local artisans
            </motion.div>
          </div>
        </MotionReveal>

        <MotionReveal
          className="relative min-h-[330px] w-full sm:min-h-[390px] md:min-h-[430px] lg:min-h-[500px] xl:min-h-[620px]"
          delay={0.14}
          direction="left"
        >
          <motion.div
            className={`absolute inset-x-8 top-0 h-[88%] border border-border-main ${
              theme === "dark" ? "bg-white/[0.03]" : "bg-black/[0.02]"
            }`}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-0 top-8 h-[68%] w-[70%] overflow-hidden border border-border-main bg-brand-red shadow-2xl shadow-brand-red/20"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-full w-full bg-[radial-gradient(circle_at_16px_16px,rgba(255,255,255,0.82)_0_2px,transparent_2.5px),linear-gradient(135deg,rgba(197,160,89,0.8),transparent_28%),linear-gradient(90deg,rgba(6,48,32,0.5),transparent_52%)] bg-[length:34px_34px,100%_100%,100%_100%]" />
          </motion.div>
          <motion.div
            className="absolute bottom-0 right-0 h-[66%] w-[72%] overflow-hidden border border-border-main bg-brand-green shadow-2xl shadow-brand-green/20"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="h-full w-full bg-[radial-gradient(circle_at_14px_14px,rgba(245,242,235,0.72)_0_1.7px,transparent_2.2px),linear-gradient(45deg,rgba(184,37,46,0.72),transparent_36%),linear-gradient(140deg,transparent_58%,rgba(197,160,89,0.85)_58%_63%,transparent_63%)] bg-[length:28px_28px,100%_100%,100%_100%]" />
          </motion.div>
          <motion.div
            className="absolute bottom-6 left-5 w-[82%] border border-border-main bg-bg-main/94 p-4 backdrop-blur sm:left-8 sm:p-5 lg:bottom-10 lg:left-10 lg:w-[78%]"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          >
            <p className="font-header text-xl font-semibold text-text-main sm:text-2xl">
              New festive Bandhani edit
            </p>
            <p className="mt-1 text-sm leading-6 text-text-muted">
              Sarees, dress materials, dupattas, and curated gift picks in
              deep reds, emeralds, and zari-inspired gold.
            </p>
          </motion.div>
        </MotionReveal>
      </div>
    </section>
  );
}
