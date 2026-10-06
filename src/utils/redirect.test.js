import { describe, expect, it } from 'vitest';
import { getSafeRedirect } from './redirect';

describe('getSafeRedirect', () => {
  it('returns the page the visitor was heading to', () => {
    expect(getSafeRedirect('?redirect=/checkout')).toBe('/checkout');
  });

  it('falls back when there is no redirect', () => {
    expect(getSafeRedirect('')).toBe('/');
    expect(getSafeRedirect('', '/account')).toBe('/account');
  });

  it('never sends a visitor to another website', () => {
    expect(getSafeRedirect('?redirect=https://evil.example')).toBe('/');
    expect(getSafeRedirect('?redirect=//evil.example')).toBe('/');
    expect(getSafeRedirect('?redirect=/\\evil.example')).toBe('/');
    expect(getSafeRedirect('?redirect=javascript:alert(1)')).toBe('/');
  });
});
