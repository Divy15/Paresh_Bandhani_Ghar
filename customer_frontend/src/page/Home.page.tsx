import HomeHero from "../components/Home/HomeHero";
import ProductShowcase from "../components/Home/ProductShowcase";
import ReviewMarquee from "../components/Home/ReviewMarquee";
import StatsCounter from "../components/Home/StatsCounter";

interface HomePageProps {
  onShopNow: () => void;
}

export default function HomePage({ onShopNow }: HomePageProps) {
  return (
    <div className="bg-bg-main text-text-main">
      <HomeHero onShopNow={onShopNow} />
      <StatsCounter />
      <ReviewMarquee />
      <ProductShowcase />
    </div>
  );
}
