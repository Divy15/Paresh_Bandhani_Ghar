import { ProductGrid } from "../CommonComponent/ProductGrid";
import MotionReveal from "../CommonComponent/MotionReveal";

export default function ProductShowcase() {
  return (
    <section className="bg-bg-main px-4 py-14 sm:px-6 lg:px-8 w-full">
      <div className="mx-auto max-w-7xl">
        <MotionReveal
          className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end"
          direction="up"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-red font-body">
              Fresh Collection
            </p>
            <h2 className="mt-2 text-4xl font-bold text-text-main sm:text-5xl font-header">
              Newly arrived and top picks
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-text-muted font-body">
            Explore our heritage Gujarati Bandhani craft infinitely. Scroll down to trigger prefetching of more traditional sarees, dresses, and dupattas dynamically.
          </p>
        </MotionReveal>

        {/* Dynamic Infinite Scroll Product Grid */}
        <ProductGrid categoryId={null} subcategoryId={null} />
      </div>
    </section>
  );
}