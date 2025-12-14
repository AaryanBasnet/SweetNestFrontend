import {
  Heart,
  Users,
  ChefHat,
  Leaf,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import img1 from "../assets/baker-mixing-dough.jpg";

export default function About() {
  const navigate = useNavigate();
  const onShop = () => navigate("/shop");

  return (
    <div className="w-full font-body bg-cream text-dark">
      {/* --- MAIN CONTENT --- */}
      <main className="pt-12 pb-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* 1. HERO */}
          <section className="text-center mb-24 max-w-4xl mx-auto animate-slide-up">
            <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-accent text-xs font-bold tracking-wider uppercase mb-6">
              Established 2025
            </span>

            <h1 className="text-h1 md:text-7xl font-display font-medium leading-[1.1] mb-8">
              We believe in the <br />
              <span className="italic text-accent">Soul of Baking.</span>
            </h1>

            <p className="text-h5 text-gray-500 leading-relaxed max-w-2xl mx-auto">
              SweetNest isn't just a bakery. It's a celebration of slow living,
              organic ingredients, and the joy of sharing dessert with the ones
              you love.
            </p>
          </section>

          {/* 2. IMAGE + STORY */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-32">
            {/* Image Collage */}
            <div className="relative h-[600px] w-full">
              <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-[40px] overflow-hidden shadow-2xl z-10">
                <img
                  src={img1}
                  className="w-full h-full object-cover"
                  alt="Baker mixing dough"
                />
              </div>

              <div className="absolute bottom-0 right-0 w-2/3 h-2/3 rounded-[40px] overflow-hidden shadow-2xl border-8 border-white z-20">
                <img
                  src="https://images.unsplash.com/photo-1612203985729-70726954388c?auto=format&fit=crop&q=80&w=600"
                  className="w-full h-full object-cover"
                  alt="Cake detail"
                />
              </div>

              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                  bg-white p-6 rounded-full shadow-xl animate-pulse z-30"
              >
                <Heart size={32} className="text-accent fill-accent" />
              </div>
            </div>

            {/* Text Block */}
            <div className="lg:pl-10">
              <h3 className="text-h3 font-display font-bold mb-6">
                From a Tiny Kitchen to Your Table
              </h3>

              <div className="space-y-6 text-gray-600 leading-relaxed text-h6">
                <p>
                  It started with a single oven and a grandmother's recipe book.
                  Aaryan wanted to recreate the taste of Sunday afternoons where
                  vanilla and burnt sugar meant family.
                </p>

                <p>
                  We reject industrial baking. Every SweetNest cake is
                  small-batch. We peel our apples, zest our lemons, and avoid
                  preservatives entirely.
                </p>

                <p className="font-display text-h4 text-dark font-bold">
                  "When you taste our cake, you're tasting time, patience, and
                  care."
                </p>
              </div>

              <div className="mt-10 flex gap-4">
                <div>
                  <span className="font-display text-4xl text-accent font-bold">
                    10k+
                  </span>
                  <span className="text-xs uppercase tracking-wider text-gray-400 block">
                    Happy Clients
                  </span>
                </div>

                <div className="w-px bg-gray-200 mx-4" />

                <div>
                  <span className="font-display text-4xl text-accent font-bold">
                    25+
                  </span>
                  <span className="text-xs uppercase tracking-wider text-gray-400 block">
                    Awards Won
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 3. VALUES GRID */}
          <section className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-h2 font-display font-bold mb-4">
                Our Core Values
              </h2>
              <p className="text-gray-500 text-h6">
                The pillars that hold each tier together.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div
                className="bg-white p-10 rounded-[40px] border border-gray-100 text-center 
                  hover:shadow-xl hover:-translate-y-2 transition-all"
              >
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent">
                  <Leaf size={32} />
                </div>
                <h3 className="text-h4 font-display font-bold mb-3">
                  100% Organic
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  We partner with local farmers for dairy, eggs, and fruit. No
                  chemicals.
                </p>
              </div>

              {/* Card 2 — Dark */}
              <div className="bg-dark p-10 rounded-[40px] text-center text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ChefHat size={32} />
                </div>

                <h3 className="text-h4 font-display font-bold mb-3">
                  Artisan Craft
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  No automation. Every swirl and glaze is done by hand.
                </p>
              </div>

              {/* Card 3 */}
              <div
                className="bg-white p-10 rounded-[40px] border border-gray-100 text-center 
                  hover:shadow-xl hover:-translate-y-2 transition-all"
              >
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent">
                  <Users size={32} />
                </div>
                <h3 className="text-h4 font-display font-bold mb-3">
                  Community First
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Unsold goods donated daily. Workshops for kids.
                </p>
              </div>
            </div>
          </section>

          {/* 4. TEAM */}
        </div>
      </main>

      {/* FOOTER CTA */}
      <footer className="bg-dark text-white py-20 ml-20 mr-20 mb-10 rounded-[30px]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-h2 md:text-6xl font-display mb-8 text-white">
            Ready to taste the magic?
          </h2>

          <p className="text-white/60 text-h6 mb-10 max-w-xl mx-auto">
            Explore our artisan collection and bring sweetness home.
          </p>

          <button
            onClick={onShop}
            className="px-10 py-4 bg-white text-dark rounded-full font-bold text-lg hover:bg-orange-100 transition-colors shadow-xl flex items-center gap-2 mx-auto"
          >
            Shop Collection <ShoppingBag size={18} />
          </button>
        </div>
      </footer>
    </div>
  );
}
