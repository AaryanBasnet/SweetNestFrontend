import { motion, AnimatePresence } from "framer-motion";

const figmaSpring = {
  type: "spring",
  stiffness: 100,
  damping: 15,
  mass: 1,
  duration: 0.8,
};

const variants = {
  // New cake enters FROM the blurred background (top-right, small, behind)
  enter: {
    opacity: 0,
    scale: 0.4,
    x: 300,
    y: -150,
    z: -300,
  },
  // Cake is in front, full size, centered
  center: {
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    z: 0,
  },
  // Current cake fades out in place
  exit: {
    opacity: 0,
    scale: 0.9,
    z: -100,
  },
};

export default function HeroCarousel({ images, currentIndex }) {
  return (
    <div className="relative w-full h-full" style={{ perspective: 1200 }}>
      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt="Featured cake"
          className="absolute inset-0 w-full h-full object-contain"
          style={{ transformStyle: "preserve-3d" }}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={figmaSpring}
        />
      </AnimatePresence>
    </div>
  );
}
