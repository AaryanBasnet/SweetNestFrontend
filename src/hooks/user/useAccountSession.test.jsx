/**
 * Cart and checkout follow the signed-in account.
 *
 * Reported bug: add a cake as a guest (the header shows 1), sign in, open the
 * cart, and it is empty. The guest's item was never uploaded, and the cart
 * page replaced it with the account's empty server cart.
 */

import { renderHook, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const syncCartApi = vi.fn();
const getCartApi = vi.fn();
vi.mock('../../api/cartApi', () => ({
  syncCartApi: (...args) => syncCartApi(...args),
  getCartApi: (...args) => getCartApi(...args),
}));

import useAccountSession from './useAccountSession';
import useAuthStore from '../../stores/authStore';
import useCartStore from '../../stores/cartStore';
import useCheckoutStore from '../../stores/checkoutStore';

const guestLine = {
  _id: 'local_123',
  cakeId: 'cake-1',
  cake: { _id: 'cake-1', name: 'Test Cake' },
  quantity: 2,
  selectedWeight: { weightInKg: 1, price: 1200 },
};
const serverLine = { ...guestLine, _id: '64b000000000000000000001' };
const customCake = {
  _id: 'local_custom-9',
  cakeId: 'custom-9',
  cake: { _id: 'custom-9', name: 'My design' },
  quantity: 1,
  selectedWeight: { weightInKg: 2, price: 3000 },
};

const reply = (items) => ({ data: { data: { items, deliveryType: 'delivery', promoCode: null } } });

beforeEach(() => {
  vi.clearAllMocks();
  useAuthStore.setState({ user: null, token: null });
  useCartStore.setState({ items: [], isLoading: false, error: null, promoCode: null });
});

describe('useAccountSession', () => {
  it('uploads what a guest added when they sign in, so it is not lost', async () => {
    useCartStore.setState({ items: [guestLine] });
    syncCartApi.mockResolvedValue(reply([serverLine]));

    const { rerender } = renderHook(() => useAccountSession());
    await act(async () => {
      useAuthStore.setState({ user: { _id: 'u1' }, token: 't' });
    });
    rerender();

    expect(syncCartApi).toHaveBeenCalledTimes(1);
    expect(syncCartApi.mock.calls[0][0]).toEqual([
      { cakeId: 'cake-1', quantity: 2, selectedWeight: guestLine.selectedWeight },
    ]);
    await vi.waitFor(() => expect(useCartStore.getState().items).toEqual([serverLine]));
  });

  it('never sends lines that came from the server back up, which would double them', async () => {
    useCartStore.setState({ items: [serverLine] });
    getCartApi.mockResolvedValue(reply([serverLine]));
    useAuthStore.setState({ user: { _id: 'u1' }, token: 't' });

    renderHook(() => useAccountSession());

    await vi.waitFor(() => expect(getCartApi).toHaveBeenCalled());
    expect(syncCartApi).not.toHaveBeenCalled();
  });

  it('keeps cakes designed in the 3D builder, which only exist in this browser', async () => {
    useCartStore.setState({ items: [guestLine, customCake] });
    syncCartApi.mockResolvedValue(reply([serverLine]));
    useAuthStore.setState({ user: { _id: 'u1' }, token: 't' });

    renderHook(() => useAccountSession());

    await vi.waitFor(() =>
      expect(useCartStore.getState().items.map((i) => i._id)).toEqual([serverLine._id, customCake._id])
    );
  });

  it("clears the signed-in person's cart and delivery details when they sign out", async () => {
    useAuthStore.setState({ user: { _id: 'u1' }, token: 't' });
    getCartApi.mockResolvedValue(reply([serverLine]));
    useCartStore.setState({ items: [serverLine, customCake] });
    useCheckoutStore.setState({
      currentStep: 3,
      shippingData: { ...useCheckoutStore.getState().shippingData, address: '12 Private Road' },
    });

    renderHook(() => useAccountSession());
    await act(async () => {
      useAuthStore.setState({ user: null, token: null });
    });

    expect(useCartStore.getState().items).toEqual([customCake]);
    expect(useCheckoutStore.getState().currentStep).toBe(1);
    expect(useCheckoutStore.getState().shippingData.address).toBe('');
  });
});
