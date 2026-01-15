/**
 * Page Loader Component
 * Loading fallback for lazy-loaded pages
 */

export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream/30">
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <h1 className="font-heading text-3xl text-dark">
          SweetNest<span className="text-accent">.</span>
        </h1>

        {/* Animated dots */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-3 h-3 bg-accent/70 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-3 h-3 bg-accent/40 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
