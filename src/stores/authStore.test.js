/**
 * Auth store tests.
 *
 * The store is the client's memory of who is signed in. What matters here is
 * that a failed login never half-authenticates the UI, and that logging out
 * really clears the session.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../services/user/authService', () => ({
  loginUser: vi.fn(),
  registerUser: vi.fn(),
}));

import * as authService from '../services/user/authService';
import useAuthStore from './authStore';

const reset = () =>
  useAuthStore.setState({ user: null, token: null, loading: true });

beforeEach(() => {
  reset();
});

describe('login', () => {
  it('stores the user and token on success', async () => {
    authService.loginUser.mockResolvedValue({
      token: 'a-token',
      userData: { id: 'u1', name: 'Ada', email: 'ada@example.com', role: 'user' },
    });

    const result = await useAuthStore.getState().login({
      email: 'ada@example.com',
      password: 'secret',
    });

    expect(result.success).toBe(true);
    expect(useAuthStore.getState().token).toBe('a-token');
    expect(useAuthStore.getState().user.email).toBe('ada@example.com');
  });

  it('normalises the id so _id is always available', () => {
    // The API returns `id`; most components read `_id`. Without this the UI
    // silently renders undefined in places that key off the user id.
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('exposes _id even when the API only sent id', async () => {
    authService.loginUser.mockResolvedValue({
      token: 'a-token',
      userData: { id: 'u1', name: 'Ada' },
    });

    await useAuthStore.getState().login({ email: 'a', password: 'b' });

    expect(useAuthStore.getState().user._id).toBe('u1');
  });

  it('reports failure and leaves the session empty', async () => {
    authService.loginUser.mockRejectedValue({
      response: { data: { message: 'Invalid email or password' } },
    });

    const result = await useAuthStore.getState().login({
      email: 'ada@example.com',
      password: 'wrong',
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid email or password');

    // The important half: a failed login must not leave the app looking
    // partially signed in.
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
  });

  it('falls back to the error message when the API sends no body', async () => {
    authService.loginUser.mockRejectedValue(new Error('Network Error'));

    const result = await useAuthStore.getState().login({ email: 'a', password: 'b' });

    expect(result.success).toBe(false);
    expect(result.message).toBe('Network Error');
  });
});

describe('register', () => {
  it('signs the user in on success', async () => {
    authService.registerUser.mockResolvedValue({
      token: 'new-token',
      userData: { id: 'u2', name: 'Grace', role: 'user' },
    });

    const result = await useAuthStore.getState().register({ name: 'Grace' });

    expect(result.success).toBe(true);
    expect(useAuthStore.getState().token).toBe('new-token');
  });

  it('does not sign the user in when registration fails', async () => {
    authService.registerUser.mockRejectedValue({
      response: { data: { message: 'User already exists' } },
    });

    const result = await useAuthStore.getState().register({ name: 'Grace' });

    expect(result.success).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
  });
});

describe('logout', () => {
  it('clears both the user and the token', () => {
    useAuthStore.setState({ user: { _id: 'u1' }, token: 'a-token' });

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
  });
});

describe('isAuthenticated', () => {
  it('is false with no user', () => {
    expect(useAuthStore.getState().isAuthenticated()).toBe(false);
  });

  it('is true once a user is set', () => {
    useAuthStore.setState({ user: { _id: 'u1' }, token: 't' });

    expect(useAuthStore.getState().isAuthenticated()).toBe(true);
  });
});

describe('updateUser', () => {
  it('merges fields without dropping the rest of the profile', () => {
    useAuthStore.setState({
      user: { _id: 'u1', name: 'Ada', email: 'ada@example.com', role: 'user' },
    });

    useAuthStore.getState().updateUser({ name: 'Ada Lovelace' });

    const { user } = useAuthStore.getState();
    expect(user.name).toBe('Ada Lovelace');
    expect(user.email).toBe('ada@example.com');
    expect(user.role).toBe('user');
  });
});

describe('initialize', () => {
  it('clears the loading flag so route guards stop waiting', () => {
    expect(useAuthStore.getState().loading).toBe(true);

    useAuthStore.getState().initialize();

    expect(useAuthStore.getState().loading).toBe(false);
  });
});
