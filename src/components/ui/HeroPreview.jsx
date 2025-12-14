import { motion } from "framer-motion";

const springTransition = { type: "spring", stiffness: 100, damping: 15, mass: 1 };

export default function HeroPreview({ image }) {
  return (
    <div className="w-40 h-40 blur-sm overflow-hidden rounded-lg">
      <motion.img
        src={image}
        alt="Next cake preview"
        className="w-full h-full object-cover"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={springTransition}
      />
    </div>
  );
}
