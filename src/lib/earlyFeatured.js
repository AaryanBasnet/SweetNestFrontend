/**
 * The home page's hero cakes, requested before the app has even loaded.
 *
 * The hero photo is the biggest thing on the page, but its address lives in the
 * featured-cakes answer from the API. Asking only once the app had downloaded,
 * started and rendered meant the photo began loading about a second late.
 * index.html starts the request straight away and leaves the pending answer on
 * window.__earlyFeatured; this hands it to the first caller that wants the same
 * thing, once. Everything after that (a refetch, a different limit) goes to the
 * API in the usual way.
 */

/** The early request's answer, or null if there is none or it is for a different limit. */
export function takeEarlyFeatured(limit) {
  const early = typeof window === 'undefined' ? null : window.__earlyFeatured;
  if (!early || early.limit !== limit) return null;

  delete window.__earlyFeatured;
  return early.promise;
}
