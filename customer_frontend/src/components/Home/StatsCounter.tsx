import { Clock3, PackageCheck, ShoppingCart, Smile, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import MotionReveal from "../CommonComponent/MotionReveal";

const stats = [
  { label: "Total Products", value: "480+", icon: PackageCheck },
  { label: "Satisfied Customers", value: "12k+", icon: Smile },
  { label: "On-Time Delivered", value: "98%", icon: Clock3 },
  { label: "Monthly Product Sales", value: "1.8k+", icon: TrendingUp },
  { label: "Total Orders Done", value: "25k+", icon: ShoppingCart },
];

export default function StatsCounter() {
  return (
    <section className="bg-bg-main px-4 py-12 sm:px-6 lg:px-8">
      <MotionReveal className="mx-auto grid max-w-7xl grid-cols-2 border-y border-l border-border-main sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              className="min-h-36 border-r border-border-main p-5 transition hover:bg-brand-yellow/10"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.08, duration: 0.55 }}
              whileHover={{ y: -6 }}
            >
              <Icon size={22} className="mb-5 text-brand-red" />
              <p className="font-header text-4xl font-bold text-text-main">
                {stat.value}
              </p>
              <p className="mt-2 text-xs font-medium uppercase leading-5 tracking-[0.18em] text-text-muted">
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </MotionReveal>
    </section>
  );
}
