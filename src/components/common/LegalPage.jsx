import { Link } from "react-router-dom";

/**
 * Shared layout for the Privacy Policy and Terms of Use pages.
 * `sections` is a list of { heading, body } where body is an array of
 * paragraphs (strings) or bullet lists ({ list: [...] }).
 */
export default function LegalPage({ title, updated, intro, sections }) {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <p className="text-accent font-bold tracking-widest uppercase text-xs mb-3">
        Last updated {updated}
      </p>
      <h1 className="text-4xl sm:text-5xl text-dark mb-6">{title}</h1>
      <p className="text-dark/70 leading-relaxed mb-10">{intro}</p>

      <div className="space-y-10">
        {sections.map(({ heading, body }) => (
          <div key={heading}>
            <h2 className="text-2xl text-dark mb-3">{heading}</h2>
            <div className="space-y-3 text-dark/70 leading-relaxed">
              {body.map((block, i) =>
                typeof block === "string" ? (
                  <p key={i}>{block}</p>
                ) : (
                  <ul key={i} className="list-disc pl-5 space-y-1.5">
                    {block.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-12 pt-8 border-t border-dark/10 text-dark/70">
        Questions about this page? Reach us through our{" "}
        <Link to="/contact" className="text-accent hover:underline">
          contact page
        </Link>
        .
      </p>
    </section>
  );
}
