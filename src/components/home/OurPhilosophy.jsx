import { useNavigate } from "react-router-dom";

const STATS = [
  { value: "20+", label: "Master Chefs" },
  { value: "100%", label: "Sustainable" },
  { value: "0", label: "Preservatives" },
];

export default function OurPhilosophy() {
  const navigate = useNavigate();
  return (
    <section className="bg-[#F5F5F0] py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Image Collage */}
          <div className="relative">
            <div className="aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl relative z-10 w-4/5 mx-auto lg:ml-0 lg:mr-auto">
              <img
                src="https://images.unsplash.com/photo-1589476993333-f55b84301219?q=80&w=1000&auto=format&fit=crop"
                className="w-full h-full object-cover"
                alt="Baker hands"
              />
            </div>
            {/* Secondary overlapping image */}
            <div className="absolute -bottom-12 -right-4 lg:-right-12 w-2/3 aspect-square rounded-[2.5rem] overflow-hidden shadow-xl border-8 border-cream-100 z-20 hidden md:block">
              <img
                src="/src/assets/coffee_and_chocolate.jpg"
                className="w-full h-full object-cover"
                alt="Detail"
              />
            </div>
            {/* Decorative Circle */}
            <div className="absolute top-10 -left-10 w-32 h-32 bg-accent rounded-full opacity-10 blur-2xl z-0"></div>
          </div>

          {/* Right: Text Content */}
          <div className="lg:pl-12">
            <h2 className="text-6xl md:text-7xl font-serif text-primary mb-8 leading-none">
              The Art of <br />
              <span className="italic text-accent">Slow Baking.</span>
            </h2>

            <div className="flex gap-4 mb-8">
              <div className="w-px h-24 bg-primary/20"></div>
              <p className="text-xl md:text-2xl font-serif text-primary/80 italic leading-relaxed">
                "We don't just bake cakes; we curate memories that linger long after the last bite."
              </p>
            </div>

            <p className="text-lg text-primary/60 mb-10 leading-relaxed font-sans font-light">
              Founded in 2025, SweetNest began as a small kitchen experiment with a simple mission: to bring back the authentic taste of natural ingredients. In a world of mass production, we choose the slow path. Every batter is mixed by hand, every fruit is sliced fresh, and every decoration is placed with intention.
            </p>

            <div className="flex flex-col sm:flex-row gap-8">
              {STATS.map((stat, index) => (
                <div key={index}>
                  <span className="block text-4xl font-serif text-primary mb-1">{stat.value}</span>
                  <span className="text-sm font-bold uppercase tracking-widest text-primary/40">{stat.label}</span>
                </div>
              ))}
            </div>

            <button
            onClick={()=> navigate('/about')}
            className="mt-12 px-8 py-4 bg-transparent border-b border-primary text-primary font-bold tracking-widest uppercase hover:text-accent hover:border-accent transition-colors">
              
              Read Our Full Story
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
