import { Star } from "lucide-react";
import MotionReveal from "../CommonComponent/MotionReveal";

const reviews = [
  {
    name: "Riddhi Shah",
    city: "Ahmedabad",
    quote: "The red Bandhani saree looked rich in person and arrived perfectly packed for the function.",
  },
  {
    name: "Meera Patel",
    city: "Surat",
    quote: "Beautiful dupatta quality. The colors stayed bright and the zari border felt premium.",
  },
  {
    name: "Nisha Joshi",
    city: "Vadodara",
    quote: "My dress material was stitched for Navratri and everyone asked where I bought it.",
  },
  {
    name: "Krupa Desai",
    city: "Rajkot",
    quote: "Fast delivery, polite guidance, and very good fabric selection for gifting.",
  },
];

export default function ReviewMarquee() {
  const marqueeReviews = [...reviews, ...reviews];

  return (
    <section className="overflow-hidden border-y border-border-main bg-brand-green py-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <MotionReveal
          className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end flex-1"
          direction="up"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-yellow">
              Customer Reviews
            </p>
            <h2 className="mt-2 text-4xl font-bold text-white">
              Loved by Bandhani buyers
            </h2>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/70">
            Sample testimonials are shown here until real customer reviews are
            connected from your product/order data.
          </p>
        </MotionReveal>
      </div>

      <div className="home-marquee flex w-max gap-4">
        {marqueeReviews.map((review, index) => (
          <article
            key={`${review.name}-${index}`}
            className="w-[310px] border border-white/15 bg-white/[0.08] p-5 backdrop-blur sm:w-[380px]"
          >
            <div className="mb-5 flex items-center gap-1 text-brand-yellow">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <Star key={starIndex} size={15} fill="currentColor" />
              ))}
            </div>
            <p className="min-h-24 text-sm leading-6 text-white/85">
              "{review.quote}"
            </p>
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="font-header text-xl font-semibold text-white">
                {review.name}
              </p>
              <p className="text-xs uppercase tracking-[0.22em] text-white/55">
                {review.city}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
