import { afterEach, describe, expect, it } from 'vitest';
import { takeEarlyFeatured } from './earlyFeatured';

afterEach(() => {
  delete window.__earlyFeatured;
});

describe('takeEarlyFeatured', () => {
  it('hands over the early request once', async () => {
    const answer = { success: true, data: [{ name: 'Midnight Truffle' }] };
    window.__earlyFeatured = { limit: 2, promise: Promise.resolve(answer) };

    expect(await takeEarlyFeatured(2)).toBe(answer);
    expect(takeEarlyFeatured(2)).toBeNull();
  });

  it('leaves it alone when the caller wants a different number of cakes', () => {
    window.__earlyFeatured = { limit: 2, promise: Promise.resolve({}) };

    expect(takeEarlyFeatured(8)).toBeNull();
    expect(window.__earlyFeatured).toBeDefined();
  });

  it('is null when index.html did not start a request', () => {
    expect(takeEarlyFeatured(2)).toBeNull();
  });
});
