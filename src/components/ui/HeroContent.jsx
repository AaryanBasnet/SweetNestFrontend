// `motion` is used as <motion.div>; core ESLint does not count JSX member
// expressions as a use, so it reports a false "unused" here.
// eslint-disable-next-line no-unused-vars
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

export default function HeroContent({
  cake,
  onOrderClick,
  count = 0,
  index = 0,
  interval = 5000,
  onSelect,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full z-10">
      {/* HEIGHT ADJUSTMENTS:
         - h-[260px]: Reduced for Mobile (was 380px) to close the gap.
         - md:h-[350px]: Increased for Desktop (was 280px) for more space.
      */}
      {/* lg is taller: its narrower column wraps the cake's name onto two lines. */}
      <div className="relative h-[240px] sm:h-[300px] md:h-[300px] lg:h-[340px] xl:h-[300px] w-full">
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

            <p className="text-sm sm:text-base md:text-lg font-light max-w-xl mt-2 md:mt-5 leading-relaxed opacity-90 line-clamp-3">
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
          onClick={() => navigate("/custompage")}
          className="bg-accent text-white rounded-full px-6 py-3 md:px-8 md:py-3 font-medium text-base md:text-lg hover:bg-orange-700 transition-colors whitespace-nowrap"
        >
          Custom Cake
        </button>
      </div>

      {/* Which cake is showing, and how long until the next one */}
      {count > 1 && (
        <div className="flex items-center justify-center lg:justify-start gap-2 mt-5">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelect?.(i)}
              aria-label={`Show cake ${i + 1} of ${count}`}
              aria-current={i === index}
              className="group py-2"
            >
              <span
                className={`relative block h-1 rounded-full overflow-hidden bg-dark/15 transition-all duration-500 ease-out group-hover:bg-dark/25 ${
                  i === index ? "w-12" : "w-5"
                }`}
              >
                {i === index && (
                  <motion.span
                    key={index}
                    className="absolute inset-0 bg-accent origin-left rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: interval / 1000, ease: "linear" }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
