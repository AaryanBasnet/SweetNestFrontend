/**
 * Where to go after signing in. The cart sends a visitor to
 * /login?redirect=/checkout, and this reads that back. Only paths on this site
 * are accepted, so a crafted link cannot send someone to another website.
 */
export function getSafeRedirect(search, fallback = '/') {
  const target = new URLSearchParams(search).get('redirect');

  if (!target || !target.startsWith('/') || target.startsWith('//') || target.includes('\\')) {
    return fallback;
  }
  return target;
}
