/**
 * Cart pricing tests.
 *
 * These numbers are what the customer reads before they pay, so the arithmetic
 * is worth pinning down - especially the promo-code branch, which accepts
 * several different shapes of discount object.
 *
 * Note this is the CLIENT's view of the total. The server recomputes it
 * independently (see the backend cart and order tests); the client figure is
 * display only and is never trusted for payment.
 */

import { beforeEach, describe, expect, it } from 'vitest';
import useCartStore from './cartStore';

const item = (price, quantity = 1, weightInKg = 1) => ({
  cake: { _id: `cake-${weightInKg}`, name: 'Test Cake' },
  quantity,
  selectedWeight: { weightInKg, label: `${weightInKg} kg`, price },
});

const setCart = (state) => useCartStore.setState(state);

beforeEach(() => {
  useCartStore.setState({
    items: [],
    deliveryType: 'delivery',
    promoCode: null,
    isLoading: false,
    error: null,
    isSynced: false,
  });
});

describe('getSubtotal', () => {
  it('is zero for an empty cart', () => {
    expect(useCartStore.getState().getSubtotal()).toBe(0);
  });

  it('multiplies price by quantity', () => {
    setCart({ items: [item(1200, 3)] });

    expect(useCartStore.getState().getSubtotal()).toBe(3600);
  });

  it('sums across multiple lines', () => {
    setCart({ items: [item(1200, 2, 1), item(2200, 1, 2)] });

    expect(useCartStore.getState().getSubtotal()).toBe(4600);
  });

  it('treats a missing price as zero rather than producing NaN', () => {
    // A NaN here would render as "Rs NaN" in the UI, which is worse than a
    // wrong number because it looks broken to the customer.
    setCart({ items: [{ quantity: 2, selectedWeight: {} }] });

    expect(useCartStore.getState().getSubtotal()).toBe(0);
  });

  it('defaults a missing quantity to one', () => {
    setCart({ items: [{ selectedWeight: { price: 500 } }] });

    expect(useCartStore.getState().getSubtotal()).toBe(500);
  });
});

describe('getShipping', () => {
  it('charges for delivery', () => {
    setCart({ deliveryType: 'delivery' });

    expect(useCartStore.getState().getShipping()).toBe(100);
  });

  it('is free for pickup', () => {
    setCart({ deliveryType: 'pickup' });

    expect(useCartStore.getState().getShipping()).toBe(0);
  });
});

describe('getTotal', () => {
  it('adds shipping to the subtotal', () => {
    setCart({ items: [item(1200)] });

    expect(useCartStore.getState().getTotal()).toBe(1300);
  });

  it('omits shipping for pickup', () => {
    setCart({ items: [item(1200)], deliveryType: 'pickup' });

    expect(useCartStore.getState().getTotal()).toBe(1200);
  });

  it('subtracts a fixed discountAmount', () => {
    setCart({ items: [item(1000)], promoCode: { discountAmount: 200 } });

    expect(useCartStore.getState().getTotal()).toBe(900); // 1000 + 100 - 200
  });

  it('applies a percentage discount to the subtotal only, not shipping', () => {
    setCart({
      items: [item(1000)],
      promoCode: { discountType: 'percentage', discountValue: 10 },
    });

    // 10% of 1000 = 100 off; shipping is still charged in full.
    expect(useCartStore.getState().getTotal()).toBe(1000);
  });

  it('caps a percentage discount at maxDiscount', () => {
    setCart({
      items: [item(10000)],
      promoCode: {
        discountType: 'percentage',
        discountValue: 50,
        maxDiscount: 1000,
      },
    });

    // 50% would be 5000, but the cap holds it to 1000.
    expect(useCartStore.getState().getTotal()).toBe(9100);
  });

  it('applies a fixed discountValue when the type is not percentage', () => {
    setCart({
      items: [item(1000)],
      promoCode: { discountType: 'fixed', discountValue: 300 },
    });

    expect(useCartStore.getState().getTotal()).toBe(800);
  });

  // An over-large coupon must not produce a negative total, which would read
  // as the shop owing the customer money.
  it('never goes below zero', () => {
    setCart({ items: [item(100)], promoCode: { discountAmount: 99999 } });

    expect(useCartStore.getState().getTotal()).toBe(0);
  });

  it('ignores a malformed promo code rather than producing NaN', () => {
    setCart({ items: [item(1000)], promoCode: { discountType: 'percentage' } });

    expect(useCartStore.getState().getTotal()).toBe(1100);
  });

  it('is just shipping when the cart is empty', () => {
    expect(useCartStore.getState().getTotal()).toBe(100);
  });
});

describe('getItemCount', () => {
  it('counts units, not lines', () => {
    setCart({ items: [item(1200, 2, 1), item(2200, 3, 2)] });

    expect(useCartStore.getState().getItemCount()).toBe(5);
  });

  it('is zero for an empty cart', () => {
    expect(useCartStore.getState().getItemCount()).toBe(0);
  });
});

describe('isInCart', () => {
  it('matches on cake and weight together', () => {
    setCart({ items: [item(1200, 1, 1)] });
    const { isInCart } = useCartStore.getState();

    expect(isInCart('cake-1', 1)).toBe(true);
    // Same cake, different weight: a separate line, not "in the cart".
    expect(isInCart('cake-1', 2)).toBe(false);
    expect(isInCart('cake-other', 1)).toBe(false);
  });
});
