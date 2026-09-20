/**
 * Route guard tests.
 *
 * These guards decide what a signed-out or non-admin visitor sees. They are
 * a UX guard, not a security boundary - the API enforces authorisation
 * independently (see the backend admin-route tests). Worth stating, because
 * the store they read from lives in localStorage and a visitor can edit it.
 */

import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import AdminRoute from './AdminRoute';
import ProtectedRoute from './ProtectedRoute';
import useAuthStore from '../stores/authStore';

// Takes the element rather than the component: passing a component and
// rendering <Guard /> reads as an unused parameter to eslint, which does not
// track JSX element names as references without eslint-plugin-react.
const renderGuard = (guardElement) =>
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin" element={guardElement}>
          <Route index element={<div>Secret admin panel</div>} />
        </Route>
        <Route path="/login" element={<div>Login page</div>} />
      </Routes>
    </MemoryRouter>
  );

const signIn = (role) =>
  useAuthStore.setState({ user: { _id: 'u1', role }, token: 't', loading: false });

beforeEach(() => {
  useAuthStore.setState({ user: null, token: null, loading: false });
});

describe('AdminRoute', () => {
  it('shows a loader while auth is still initialising', () => {
    useAuthStore.setState({ user: null, token: null, loading: true });

    renderGuard(<AdminRoute />);

    // Must not flash the login page before the store has rehydrated, or a
    // signed-in admin gets bounced on every refresh.
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(screen.queryByText('Secret admin panel')).not.toBeInTheDocument();
  });

  it('redirects a signed-out visitor to login', () => {
    renderGuard(<AdminRoute />);

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('shows Forbidden to a signed-in non-admin', () => {
    signIn('user');

    renderGuard(<AdminRoute />);

    expect(screen.queryByText('Secret admin panel')).not.toBeInTheDocument();
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
  });

  it('renders the admin content for an admin', () => {
    signIn('admin');

    renderGuard(<AdminRoute />);

    expect(screen.getByText('Secret admin panel')).toBeInTheDocument();
  });
});

describe('ProtectedRoute', () => {
  it('shows a loader while auth is still initialising', () => {
    useAuthStore.setState({ user: null, token: null, loading: true });

    renderGuard(<ProtectedRoute />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('redirects a signed-out visitor to login', () => {
    renderGuard(<ProtectedRoute />);

    expect(screen.getByText('Login page')).toBeInTheDocument();
  });

  it('lets any signed-in user through', () => {
    signIn('user');

    renderGuard(<ProtectedRoute />);

    expect(screen.getByText('Secret admin panel')).toBeInTheDocument();
  });
});
