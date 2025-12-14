import { Wheat, Truck, ChefHat } from "lucide-react";

const FEATURES = [
  {
    icon: Wheat,
    title: "Organic Ingredients",
    description: "We source locally grown, 100% organic flour and fresh fruits for a guilt-free indulgence.",
    variant: "light",
  },
  {
    icon: Truck,
    title: "Track Your Order",
    description: "Follow your order's journey as it's baked, packed, and delivered right to your door.",
    variant: "dark",
  },
  {
    icon: ChefHat,
    title: "Master Patissiers",
    description: "Every cake is a piece of art, crafted by our award-winning team of pastry chefs.",
    variant: "light",
  },
];

function FeatureCard({ icon: Icon, title, description, variant }) {
  if (variant === "dark") {
    return (
      <div className="bg-dark p-8 rounded-2xl text-white">
        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
          <Icon className="text-white" size={24} strokeWidth={1.5} />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-white/70 text-sm leading-relaxed">{description}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl">
      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
        <Icon className="text-accent" size={24} strokeWidth={1.5} />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
      <p className="text-primary/60 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export default function FeaturesGrid() {
  return (
    <section className="bg-[#F5F5F0] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
