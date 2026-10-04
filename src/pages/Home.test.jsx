/**
 * Home page hero tests.
 *
 * The hero is the first thing every visitor sees, and it has two data paths:
 * the featured cakes from the API, and a built-in fallback used whenever the
 * API has fewer than two. The fallback path is exactly the one that only runs
 * when something is already wrong (slow network, API down, only one cake
 * marked featured), so it is the path most likely to be broken without anyone
 * noticing.
 */

import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Everything below the hero is irrelevant here and pulls in a lot of code.
vi.mock('../components/home', () => ({
  FeaturesGrid: () => null,
  OurPhilosophy: () => null,
  CrowdFavorites: () => null,
  SeasonalCollection: () => null,
}));

const useFeaturedCakes = vi.fn();
vi.mock('../hooks/cake', () => ({
  useFeaturedCakes: (...args) => useFeaturedCakes(...args),
}));

import Home from './Home';

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

/** Every hero picture currently in the DOM (desktop and mobile both render). */
const heroPictures = () => [...document.querySelectorAll('img[alt="Featured cake"]')];

const apiCake = (name, slug, url) => ({
  _id: slug,
  name,
  slug,
  basePrice: 500,
  description: `${name} description`,
  flavorTags: ['Chocolate'],
  images: [{ url }],
});

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('hero - with two featured cakes from the API', () => {
  beforeEach(() => {
    useFeaturedCakes.mockReturnValue({
      isLoading: false,
      data: {
        data: [
          apiCake('Dark Chocolate Cake', 'dark-choc', 'https://img.test/choc.png'),
          apiCake('Strawberry Cheesecake', 'straw', 'https://img.test/straw.png'),
        ],
      },
    });
  });

  it("shows the first cake's picture", () => {
    renderHome();

    const sources = heroPictures().map((img) => img.getAttribute('src'));
    expect(sources).toContain('https://img.test/choc.png');
  });

  it('switches to the second cake after the interval', () => {
    renderHome();

    act(() => {
      vi.advanceTimersByTime(5100);
    });

    const sources = heroPictures().map((img) => img.getAttribute('src'));
    expect(sources).toContain('https://img.test/straw.png');
  });
});

describe('hero - fallback when the API has fewer than two featured cakes', () => {
  // ==========================================================================
  // The bug. The fallback cakes carried their picture under `images`, but the
  // carousel reads `image`. So whenever the fallback was used - while the API
  // was still loading, if it was down, or if only one cake was featured - the
  // carousel was handed [undefined, undefined] and rendered <img src=undefined>:
  // a headline and price with no cake.
  // ==========================================================================
  const scenarios = {
    'while the API is still loading': { isLoading: true, data: undefined },
    'when the API returns nothing': { isLoading: false, data: { data: [] } },
    'when only one cake is featured': {
      isLoading: false,
      data: { data: [apiCake('Lonely Cake', 'lonely', 'https://img.test/lonely.png')] },
    },
    'when the request failed': { isLoading: false, data: undefined },
  };

  Object.entries(scenarios).forEach(([name, result]) => {
    it(`still shows a cake picture ${name}`, () => {
      useFeaturedCakes.mockReturnValue(result);

      renderHome();

      const sources = heroPictures().map((img) => img.getAttribute('src'));

      expect(sources.length).toBeGreaterThan(0);
      sources.forEach((src) => {
        expect(src).toBeTruthy();
        expect(src).not.toBe('undefined');
      });
    });
  });

  it('still switches between the two fallback cakes', () => {
    useFeaturedCakes.mockReturnValue({ isLoading: true, data: undefined });

    renderHome();

    const first = heroPictures().map((img) => img.getAttribute('src'));

    act(() => {
      vi.advanceTimersByTime(5100);
    });

    const second = heroPictures().map((img) => img.getAttribute('src'));

    expect(second.some((src) => src && !first.includes(src))).toBe(true);
  });

  it('shows the fallback headline', () => {
    useFeaturedCakes.mockReturnValue({ isLoading: true, data: undefined });

    renderHome();

    expect(screen.getAllByText(/cheesecake/i).length).toBeGreaterThan(0);
  });
});
