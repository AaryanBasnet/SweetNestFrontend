/**
 * Error boundary tests.
 *
 * Worth testing precisely because this component only ever runs when
 * something else has already gone wrong - so if it is broken, you find out at
 * the worst possible moment.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import ErrorBoundary from './ErrorBoundary';

const Boom = () => {
  throw new Error('Kaboom');
};

const Fine = () => <div>Everything is fine</div>;

// React logs caught errors to console.error regardless of the boundary. That
// is expected here, so it is silenced to keep the test output readable.
let consoleError;
beforeEach(() => {
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => {
  consoleError.mockRestore();
});

describe('ErrorBoundary', () => {
  it('renders children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <Fine />
      </ErrorBoundary>
    );

    expect(screen.getByText('Everything is fine')).toBeInTheDocument();
  });

  it('shows a fallback instead of a blank page when a child throws', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('offers the user a way out', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );

    // A dead end is barely better than a white screen - there must be an
    // action available.
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /back to home/i })).toBeInTheDocument();
  });

  it('does not render the broken child once it has caught', () => {
    render(
      <ErrorBoundary>
        <Boom />
        <Fine />
      </ErrorBoundary>
    );

    // React unmounts the whole subtree, siblings included.
    expect(screen.queryByText('Everything is fine')).not.toBeInTheDocument();
  });

  it('navigates home when asked', async () => {
    // jsdom has no real navigation, so window.location is replaced with a
    // plain object we can assert against.
    const original = window.location;
    delete window.location;
    window.location = { href: '', reload: vi.fn() };

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );

    await userEvent.click(screen.getByRole('button', { name: /back to home/i }));
    expect(window.location.href).toBe('/');

    window.location = original;
  });

  it('reloads when asked to try again', async () => {
    const original = window.location;
    const reload = vi.fn();
    delete window.location;
    window.location = { href: '', reload };

    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );

    await userEvent.click(screen.getByRole('button', { name: /try again/i }));
    expect(reload).toHaveBeenCalled();

    window.location = original;
  });
});
