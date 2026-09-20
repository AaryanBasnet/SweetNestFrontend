/**
 * Global error boundary.
 *
 * React unmounts the ENTIRE component tree when a render throws and nothing
 * catches it - the user is left staring at a blank white page with no
 * explanation and no way back. This catches that and shows something useful
 * instead.
 *
 * Only the cake configurator had a boundary before, so a render error
 * anywhere else in the app blanked the whole site.
 *
 * What a boundary does NOT catch, because React cannot:
 *   - errors inside event handlers (use try/catch there)
 *   - errors in async code (promise rejections, setTimeout)
 *   - errors during server-side rendering
 *   - errors thrown by the boundary itself
 *
 * It must be a class component: there is still no hook equivalent of
 * componentDidCatch.
 */

import { Component } from 'react';
import PropTypes from 'prop-types';

import { captureError } from '../../lib/sentry';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Runs during the render phase - return the new state, do nothing else.
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Runs during the commit phase, where side effects are allowed. This is
  // where reporting belongs.
  componentDidCatch(error, errorInfo) {
    captureError(error, { componentStack: errorInfo?.componentStack });

    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    // A full navigation rather than router navigation: the router lives
    // inside the tree that just failed, so it may not be usable.
    window.location.href = '/';
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-6" role="img" aria-label="Broken cake">
            🍰
          </div>

          <h1 className="text-2xl font-semibold text-dark mb-3">
            Something went wrong
          </h1>

          <p className="text-dark/60 mb-8">
            This page ran into an unexpected problem. It has been reported, and
            trying again usually helps.
          </p>

          <div className="flex gap-3 justify-center">
            <button
              type="button"
              onClick={this.handleReload}
              className="px-6 py-3 rounded-full bg-dark text-white font-medium hover:opacity-90 transition"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={this.handleGoHome}
              className="px-6 py-3 rounded-full border border-dark/20 text-dark font-medium hover:bg-dark/5 transition"
            >
              Back to home
            </button>
          </div>

          {/* The message is useful while developing and noise (or an
              information leak) in production, so it only renders in dev. */}
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-8 p-4 bg-dark/5 rounded-lg text-left text-xs text-dark/70 overflow-auto max-h-48">
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      </div>
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node,
};

export default ErrorBoundary;
