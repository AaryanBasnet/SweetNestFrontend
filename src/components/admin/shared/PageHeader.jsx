/**
 * PageHeader Component
 * Header section for admin pages with title, description, and actions
 * Standalone - receives all content via props
 */

export default function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
}) {
  return (
    <div className="mb-4 sm:mb-6 lg:mb-8">
      {/* Breadcrumbs */}
      {breadcrumbs && (
        <nav className="mb-2">
          <ol className="flex items-center gap-2 text-xs sm:text-sm overflow-x-auto">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center gap-2 whitespace-nowrap">
                {index > 0 && <span className="text-dark/30">/</span>}
                {crumb.href ? (
                  <a
                    href={crumb.href}
                    className="text-dark/50 hover:text-accent transition-colors"
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-dark/70">{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-serif text-dark">{title}</h1>
          {description && (
            <p className="text-xs sm:text-sm text-dark/50 mt-1">{description}</p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2 sm:gap-3">{actions}</div>}
      </div>
    </div>
  );
}
