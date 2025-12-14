import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";

const textVariants = {
  enter: { opacity: 0, x: 30 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
};

const transition = {
  type: "spring",
  stiffness: 200,
  damping: 25,
};

export default function HeroContent({ cake }) {
  return (
    <div className="flex flex-col">
      {/* Animated content - fixed height container */}
      <div className="relative h-[280px]">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={cake.name}
            className="absolute inset-0"
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
          >
            <div>
              <p className="font-heading text-lg opacity-40">{cake.tagline}</p>
              <h1 className="text-5xl mt-2">
                <span className="font-medium">{cake.nameLight} </span>
                <span className="font-bold italic">{cake.nameBold}</span>
              </h1>
            </div>

            <p className="text-xl font-light max-w-xl mt-6">{cake.description}</p>

            <p className="text-2xl mt-6">
              <span className="italic font-normal">Starting at</span>{" "}
              <span className="font-bold">Rs. {cake.price}</span>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Static buttons - fixed position */}
      <div className="flex gap-4">
        <button className="bg-dark text-cream rounded-full px-8 py-3 flex items-center gap-2 font-medium text-lg hover:opacity-90 transition-opacity">
          Order Now
          <ShoppingCart size={20} />
        </button>
        <button className="bg-cream border border-pink-200 text-dark rounded-full px-8 py-3 font-medium text-lg hover:bg-pink-50 transition-colors">
          Custom Cake
        </button>
      </div>
    </div>
  );
}
