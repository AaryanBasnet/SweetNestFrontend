import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

export default function HeroContent({ cake, onOrderClick }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full z-10">
      {/* HEIGHT ADJUSTMENTS:
         - h-[260px]: Reduced for Mobile (was 380px) to close the gap.
         - md:h-[350px]: Increased for Desktop (was 280px) for more space.
      */}
      <div className="relative h-[240px] sm:h-[300px] md:h-[300px] w-full">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={cake.name}
            className="absolute inset-0 flex flex-col justify-start"
            variants={textVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
          >
            <div>
              <p className="font-heading text-sm md:text-lg opacity-40 tracking-wider">
                {cake.tagline}
              </p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl mt-1 md:mt-2 leading-tight">
                <span className="font-normal italic">{cake.nameLight} </span>
                <span className="font-bold">{cake.nameBold}</span>
              </h1>
            </div>

            <p className="text-sm sm:text-base md:text-xl font-light max-w-xl mt-2 md:mt-6 leading-relaxed opacity-90 line-clamp-3 md:line-clamp-none">
              {cake.description}
            </p>

            <p className="text-xl md:text-2xl mt-3 md:mt-6">
              <span className="italic font-normal text-base md:text-lg">
                Starting at
              </span>{" "}
              <span className="font-bold font-heading text-2xl md:text-3xl ml-2">
                Rs. {cake.basePrice || cake.price}
              </span>
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-0 sm:mt-2">
        <button
          onClick={onOrderClick}
          className="bg-dark text-cream rounded-full px-6 py-3 md:px-8 md:py-3 flex items-center justify-center gap-2 font-medium text-base md:text-lg hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Order Now
          <ShoppingCart size={18} className="md:w-5 md:h-5" />
        </button>
        <button
          onClick={() => navigate("/customPage")}
          className="bg-cream border border-pink-200 text-dark rounded-full px-6 py-3 md:px-8 md:py-3 font-medium text-base md:text-lg hover:bg-pink-50 transition-colors whitespace-nowrap"
        >
          Custom Cake
        </button>
      </div>
    </div>
  );
}
