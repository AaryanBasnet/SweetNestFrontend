/**
 * The registration form must ask for the password the server will accept.
 * (They disagreed: the form took any 6 characters, the server wanted 8 with
 * upper and lower case, a number and a symbol, and the failure was a surprise.)
 */

import { describe, expect, it } from 'vitest';
import { registerSchema } from './authSchema';

const valid = {
  name: 'Test Shopper',
  email: 'shopper@example.com',
  password: 'Passw0rd!2026',
  confirmPassword: 'Passw0rd!2026',
};

const passwordError = async (password) => {
  try {
    await registerSchema.validate({ ...valid, password, confirmPassword: password });
    return null;
  } catch (error) {
    return error.message;
  }
};

describe('registerSchema password', () => {
  it('accepts a password the server accepts', async () => {
    expect(await passwordError('Passw0rd!2026')).toBeNull();
  });

  it.each([
    ['too short', 'Aa1!aaa'],
    ['no uppercase letter', 'passw0rd!2026'],
    ['no lowercase letter', 'PASSW0RD!2026'],
    ['no number', 'Password!!!!'],
    ['no symbol', 'Passw0rd2026'],
    ['the old 6-character minimum', 'abcdef'],
  ])('rejects a password with %s', async (_why, password) => {
    expect(await passwordError(password)).toMatch(/8 characters/);
  });
});
