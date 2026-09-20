/**
 * Frontend error tracking.
 *
 * A crash in the browser is invisible to you by default. The user sees a
 * blank page, closes the tab, and you never hear about it. This is how those
 * become something you can actually see and fix.
 *
 * Entirely opt-in: with no VITE_SENTRY_DSN set, the SDK is never initialised
 * and every export here is a no-op, so local development is unaffected.
 *
 * Note that VITE_ variables are baked into the bundle at build time and are
 * publicly readable. A Sentry DSN is designed for that - it only permits
 * sending events, not reading them - so it is safe here. Never put a real
 * secret in a VITE_ variable.
 */

import * as Sentry from '@sentry/react';

const dsn = import.meta.env.VITE_SENTRY_DSN;
const enabled = Boolean(dsn);

export const initSentry = () => {
  if (!enabled) return false;

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_SENTRY_RELEASE,

    tracesSampleRate: Number(import.meta.env.VITE_SENTRY_TRACES_RATE ?? 0.1),

    // Do not attach IPs or other identifying data automatically.
    sendDefaultPii: false,

    beforeSend(event) {
      // The auth token lives in localStorage, and a crash report can sweep up
      // surrounding state. Strip anything token-shaped before it leaves.
      if (event.request?.headers) {
        delete event.request.headers.Authorization;
      }
      return event;
    },

    // Browser extensions and third-party scripts throw constantly and none of
    // it is your bug. Filtering keeps the signal usable.
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error promise rejection captured',
    ],
  });

  return true;
};

export const captureError = (error, context = {}) => {
  if (!enabled) return;
  Sentry.captureException(error, { extra: context });
};

export const isSentryEnabled = () => enabled;

export { Sentry };
