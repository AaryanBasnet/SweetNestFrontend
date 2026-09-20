/**
 * Axios interceptor tests.
 *
 * Every authenticated request in the app passes through these two functions,
 * so a bug here is a bug everywhere. They are tested by invoking the
 * interceptor handlers directly rather than by running real HTTP - the logic
 * under test is the header and the redirect, not the network.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

const navigate = vi.fn();

vi.mock('../utils/navigationService', () => ({
  getNavigate: () => navigate,
  setNavigate: vi.fn(),
}));

import instance from './api';

const requestHandler = instance.interceptors.request.handlers[0];
const responseHandler = instance.interceptors.response.handlers[0];

const storeToken = (token) =>
  localStorage.setItem('auth-storage', JSON.stringify({ state: { token } }));

beforeEach(() => {
  localStorage.clear();
  navigate.mockClear();
});

describe('request interceptor', () => {
  it('attaches the persisted token as a Bearer header', () => {
    storeToken('my-token');

    const config = requestHandler.fulfilled({ headers: {} });

    expect(config.headers.Authorization).toBe('Bearer my-token');
  });

  it('sends no Authorization header when signed out', () => {
    const config = requestHandler.fulfilled({ headers: {} });

    expect(config.headers.Authorization).toBeUndefined();
  });

  it('survives corrupted storage instead of throwing', () => {
    // A half-written or hand-edited localStorage entry must not take down
    // every request in the app.
    localStorage.setItem('auth-storage', 'not json at all');

    const config = requestHandler.fulfilled({ headers: {} });

    expect(config.headers.Authorization).toBeUndefined();
  });

  it('sets a JSON content type for ordinary payloads', () => {
    const config = requestHandler.fulfilled({ headers: {}, data: { a: 1 } });

    expect(config.headers['Content-Type']).toBe('application/json');
  });

  it('leaves FormData alone so axios can set the multipart boundary', () => {
    // Forcing application/json here would break every image upload: the
    // browser must generate its own multipart boundary.
    const config = requestHandler.fulfilled({
      headers: {},
      data: new FormData(),
    });

    expect(config.headers['Content-Type']).toBeUndefined();
  });
});

describe('response interceptor', () => {
  it('passes successful responses straight through', () => {
    const response = { status: 200, data: { ok: true } };

    expect(responseHandler.fulfilled(response)).toBe(response);
  });

  it('clears the session and redirects on a 401', async () => {
    storeToken('expired-token');

    await expect(
      responseHandler.rejected({
        response: { status: 401 },
        config: { url: '/orders' },
      })
    ).rejects.toBeDefined();

    expect(localStorage.getItem('auth-storage')).toBeNull();
    expect(navigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  // A 401 from the login endpoint means "wrong password", not "session
  // expired". Redirecting there would wipe the form and hide the error.
  it('does not redirect when the 401 came from the login endpoint', async () => {
    storeToken('some-token');

    await expect(
      responseHandler.rejected({
        response: { status: 401 },
        config: { url: '/users/login' },
      })
    ).rejects.toBeDefined();

    expect(navigate).not.toHaveBeenCalled();
    expect(localStorage.getItem('auth-storage')).not.toBeNull();
  });

  it('does not redirect when the 401 came from registration', async () => {
    await expect(
      responseHandler.rejected({
        response: { status: 401 },
        config: { url: '/users/register' },
      })
    ).rejects.toBeDefined();

    expect(navigate).not.toHaveBeenCalled();
  });

  it('leaves a 403 for the calling code to handle', async () => {
    storeToken('a-token');

    await expect(
      responseHandler.rejected({
        response: { status: 403 },
        config: { url: '/analytics/overview' },
      })
    ).rejects.toBeDefined();

    expect(navigate).not.toHaveBeenCalled();
    expect(localStorage.getItem('auth-storage')).not.toBeNull();
  });

  it('does not sign the user out on a network error', async () => {
    // No response at all means the server was unreachable. Treating that as
    // an auth failure would log people out whenever their wifi hiccups.
    storeToken('a-token');

    await expect(
      responseHandler.rejected({ message: 'Network Error', config: { url: '/cart' } })
    ).rejects.toBeDefined();

    expect(navigate).not.toHaveBeenCalled();
    expect(localStorage.getItem('auth-storage')).not.toBeNull();
  });
});
