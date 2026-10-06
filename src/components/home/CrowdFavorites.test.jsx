/**
 * Crowd Favorites section tests.
 *
 * It shows the top-rated cakes with number one as a spotlight. It must never
 * invent cakes (it used to fall back to fake ones with dead links), so with
 * nothing to show it renders nothing at all.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const useCakes = vi.fn();
vi.mock('../../hooks/cake', () => ({ useCakes: (...args) => useCakes(...args) }));

const addToCart = vi.fn();
vi.mock('../../stores/cartStore', () => ({
  default: (selector) => selector({ addToCart }),
}));
vi.mock('../../stores/authStore', () => ({
  default: (selector) => selector({ user: null }),
}));
vi.mock('../../stores/wishlistStore', () => ({
  default: () => ({ toggleWishlist: vi.fn(), isInWishlist: () => false }),
}));
vi.mock('react-toastify', () => ({ toast: { success: vi.fn(), error: vi.fn(), info: vi.fn() } }));

import CrowdFavorites from './CrowdFavorites';

const cake = (n, extra = {}) => ({
  _id: `id${n}`,
  slug: `cake-${n}`,
  name: `Cake ${n}`,
  description: `About cake ${n}`,
  basePrice: 500 + n,
  ratingsAverage: 5 - n / 10,
  ratingsCount: n,
  flavorTags: ['Chocolate'],
  images: [{ url: `/cake-${n}.jpg` }],
  weightOptions: [{ weightInKg: 1, price: 500, isDefault: true }],
  ...extra,
});

const renderSection = () =>
  render(
    <MemoryRouter>
      <CrowdFavorites />
    </MemoryRouter>
  );

beforeEach(() => {
  vi.clearAllMocks();
  addToCart.mockResolvedValue({ success: true });
});

describe('CrowdFavorites', () => {
  it('shows number one as the spotlight and the next two beside it', () => {
    useCakes.mockReturnValue({ isLoading: false, data: { data: [cake(1), cake(2), cake(3)] } });
    renderSection();

    expect(screen.getByText('#1 Top rated')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Cake 1' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Cake 2' })).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Cake 3' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'View Cake 2' }).getAttribute('href')).toBe('/cake/cake-2');
  });

  it('renders nothing when there are no cakes, instead of inventing some', () => {
    useCakes.mockReturnValue({ isLoading: false, data: { data: [] } });
    const { container } = renderSection();

    expect(container.firstChild).toBeNull();
  });

  it('adds the default weight of the spotlight cake to the cart', async () => {
    useCakes.mockReturnValue({ isLoading: false, data: { data: [cake(1), cake(2), cake(3)] } });
    renderSection();

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));

    await waitFor(() => expect(addToCart).toHaveBeenCalledTimes(1));
    const [item, isLoggedIn] = addToCart.mock.calls[0];
    expect(item.cakeId).toBe('id1');
    expect(item.selectedWeight.isDefault).toBe(true);
    expect(isLoggedIn).toBe(false);
  });

  it('still lays out when the shop has only one cake', () => {
    useCakes.mockReturnValue({ isLoading: false, data: { data: [cake(1)] } });
    renderSection();

    expect(screen.getByRole('heading', { name: 'Cake 1' })).toBeTruthy();
  });
});
