import { useState, useEffect } from "react";
import HeroContent from "../components/ui/HeroContent";
import HeroCarousel from "../components/ui/HeroCarousel";
import HeroPreview from "../components/ui/HeroPreview";
import {
  FeaturesGrid,
  OurPhilosophy,
  CrowdFavorites,
  SeasonalCollection,
} from "../components/home";
import strawberryCheesecake from "../assets/strawberry-cheesecake.png";
import chocolateCake from "../assets/chocolate-cake.png";

const HERO_CAKES = [
  {
    name: "Strawberry Cheesecake",
    nameLight: "Strawberry",
    nameBold: "Cheesecake",
    tagline: "Fresh • Creamy • Irresistible",
    description:
      "Smooth cream cheese base blended with real, juicy strawberries, creating a naturally sweet and creamy flavor in every bite.",
    price: 550,
    image: strawberryCheesecake,
  },
  {
    name: "Chocolate Cake",
    nameLight: "Dark",
    nameBold: "Chocolate",
    tagline: "Rich • Decadent • Heavenly",
    description:
      "Layers of moist chocolate sponge with velvety ganache, a timeless classic for chocolate lovers seeking pure indulgence.",
    price: 650,
    image: chocolateCake,
  },
];

const CAROUSEL_INTERVAL = 3000;

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_CAKES.length);
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const currentCake = HERO_CAKES[currentIndex];
  const nextIndex = (currentIndex + 1) % HERO_CAKES.length;
  const images = HERO_CAKES.map((cake) => cake.image);

  return (
    <>
      {/* Hero Section - Mobile Layout */}
      <section className="lg:hidden relative w-full overflow-hidden px-4 sm:px-6 pt-4 pb-8 sm:pt-6 sm:pb-12">
        <div className="flex flex-col items-center max-w-md mx-auto">
          {/* Mobile Carousel - Image first */}
          <div className="w-[260px] sm:w-[300px] aspect-square mb-6 sm:mb-8 relative z-0">
            <HeroCarousel images={images} currentIndex={currentIndex} mobile />
          </div>
          {/* Mobile Content - Text below image */}
          <div className="w-full text-center relative z-10">
            <HeroContent cake={currentCake} mobile />
          </div>
        </div>
      </section>

      {/* Hero Section - Desktop Layout */}
      <section className="hidden lg:block relative h-[550px] xl:h-[648px] w-full overflow-hidden mt-5 px-8 lg:px-12 xl:px-[140px]">
        <div className="absolute left-8 lg:left-12 xl:left-[140px] top-16 xl:top-24 w-[400px] lg:w-[500px] xl:w-[600px] z-10">
          <HeroContent cake={currentCake} />
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 xl:left-[calc(50%-50px)] xl:translate-x-0 -top-10 xl:-top-20 w-[400px] lg:w-[480px] xl:w-[540px] h-[550px] lg:h-[650px] xl:h-[730px]">
          <HeroCarousel images={images} currentIndex={currentIndex} />
        </div>

        <div className="hidden xl:block absolute right-[140px] top-8">
          <HeroPreview image={HERO_CAKES[nextIndex].image} />
        </div>
      </section>

      {/* Seasonal Collection Section */}
      <SeasonalCollection />

      {/* Features Grid Section */}
      <FeaturesGrid />

      {/* Crowd Favorites Section */}
      <CrowdFavorites />

      {/* Our Philosophy Section */}
      <OurPhilosophy />
    </>
  );
}
