import React from 'react';
import { motion } from 'motion/react';

export const DashboardPage: React.FC = () => {
  // Traditional textile metrics data
  const metrics = [
    { title: "Total Saree Catalog", value: "1,240+", change: "+12% this week", color: "border-brand-maroon-500" },
    { title: "Dress Material Sets", value: "850", change: "45 low stock alerts", color: "border-brand-gold-500" },
    { title: "Active Artisans / Karigars", value: "24", change: "6 processing lots", color: "border-brand-maroon-500" },
    { title: "Pending Bandhani Orders", value: "148", change: "Requires dispatch", color: "border-brand-gold-500" }
  ];

  return (
    <div className="min-h-screen bg-bg-main text-text-main transition-colors duration-300">
      
      <main className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Welcome Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-bg-card border border-border-main p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h2 className="font-serif text-2xl font-bold text-brand-maroon-500">
              Ram Ram & Welcome Back!
            </h2>
            <p className="text-sm text-text-muted mt-1">
              Here is what is happening with Paresh Bandhani Ghar operations today.
            </p>
          </div>
          <div className="text-xs bg-brand-maroon-500/10 text-brand-maroon-500 px-3 py-1.5 rounded-full font-semibold self-start md:self-auto">
            Live Production Tracker Active
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-bg-card p-5 rounded-xl border-l-4 ${metric.color} border-y border-r border-border-main shadow-sm`}
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                {metric.title}
              </p>
              <p className="text-2xl font-extrabold mt-2 text-text-main">
                {metric.value}
              </p>
              <span className="text-xs text-brand-gold-500 font-medium block mt-1">
                {metric.change}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Recent Inventory Batches */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-bg-card border border-border-main rounded-xl shadow-sm overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-border-main bg-bg-main/50">
            <h3 className="font-serif font-bold text-text-main text-lg">Latest Production Batches</h3>
          </div>
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-main text-text-muted">
                  <th className="pb-3 font-semibold">Batch ID</th>
                  <th className="pb-3 font-semibold">Product Type</th>
                  <th className="pb-3 font-semibold">Knot Technique</th>
                  <th className="pb-3 font-semibold">Base Fabric</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-main text-text-main">
                <tr className="hover:bg-bg-main/40">
                  <td className="py-3 font-mono font-medium">#BD-2026-09</td>
                  <td className="py-3">Gaji Silk Saree</td>
                  <td className="py-3">Rai Bandhej (Fine Dots)</td>
                  <td className="py-3">Pure Gaji Silk</td>
                  <td className="py-3"><span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 text-xs font-medium">Tying Dots</span></td>
                </tr>
                <tr className="hover:bg-bg-main/40">
                  <td className="py-3 font-mono font-medium">#BD-2026-10</td>
                  <td className="py-3">Georgette Dress Material</td>
                  <td className="py-3">Shikari Pattern</td>
                  <td className="py-3">Fine Georgette</td>
                  <td className="py-3"><span className="px-2 py-0.5 rounded bg-red-500/10 text-red-600 text-xs font-medium">In Dyeing Vat</span></td>
                </tr>
                <tr className="hover:bg-bg-main/40">
                  <td className="py-3 font-mono font-medium">#BD-2026-11</td>
                  <td className="py-3">Modal Silk Dupatta</td>
                  <td className="py-3">Traditional Gharchola Layout</td>
                  <td className="py-3">Premium Modal</td>
                  <td className="py-3"><span className="px-2 py-0.5 rounded bg-green-500/10 text-green-600 text-xs font-medium">Finished / Ready</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
};