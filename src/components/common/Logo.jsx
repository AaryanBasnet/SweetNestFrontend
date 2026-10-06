import { Link } from "react-router-dom";

/**
 * The SweetNest wordmark. Every place the name is shown uses this, so the
 * lettering, weight and orange full stop are the same everywhere. The look is
 * the navigation bar's, which is the reference.
 */
const SIZES = {
  md: "text-xl sm:text-2xl", // navigation bar, footer, auth pages
  lg: "text-3xl", // full-screen loading state
};

export default function Logo({ size = "md", linked = false, className = "" }) {
  const mark = (
    <span
      className={`font-heading font-semibold tracking-tight text-dark whitespace-nowrap ${SIZES[size]} ${className}`}
    >
      SweetNest<span className="text-accent">.</span>
    </span>
  );

  if (!linked) return mark;

  return (
    <Link to="/" aria-label="SweetNest home" className="shrink-0 inline-block">
      {mark}
    </Link>
  );
}
