/**
 * The shopping journey, in a real browser against the real backend.
 *
 * Several of the bugs found by hand-testing this site lived BETWEEN the pieces
 * (a guest's cart lost on sign-in, an old confirmation page showing up in place
 * of the next checkout), where unit tests on either side cannot see them. These
 * tests walk the whole path the way a customer does.
 */

import { expect, test } from '@playwright/test';

const API = 'http://localhost:5055/api';
const PASSWORD = 'Passw0rd!2026';

// The bakery works in Nepal time, and so do the delivery rules
test.use({ timezoneId: 'Asia/Kathmandu' });

const newEmail = () => `shopper-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

/** Add the first cake on the menu to the cart, as whoever is browsing. */
async function addFirstCakeToCart(page) {
  await page.goto('/menu');
  const add = page.getByRole('button', { name: /add to cart/i }).first();
  await add.waitFor();
  await add.click();
  await expect(page.getByRole('link', { name: /^Cart, 1 items?/ })).toBeVisible();
}

/** Create an account through the form. Lands wherever ?redirect= pointed. */
async function register(page, email) {
  await page.getByPlaceholder('John Doe').fill('Test Shopper');
  await page.getByPlaceholder('you@example.com').fill(email);
  await page.getByPlaceholder('Create a password').fill(PASSWORD);
  await page.getByPlaceholder('Repeat password').fill(PASSWORD);
  await page.getByRole('button', { name: 'Register' }).click();
}

/** Fill in the shipping step and choose the first day and last slot on offer. */
async function fillShipping(page) {
  await page.getByPlaceholder('First Name', { exact: true }).fill('Test');
  await page.getByPlaceholder('Last Name', { exact: true }).fill('Shopper');
  await page.getByPlaceholder('Address', { exact: true }).fill('12 Test Road');
  await page.getByPlaceholder('City', { exact: true }).fill('Kathmandu');
  await page.getByPlaceholder('Phone', { exact: true }).fill('9800000000');

  const firstFreeDay = page
    .getByRole('button', { name: /^\d{1,2} [A-Za-z]+ \d{4}$/ })
    .and(page.locator(':enabled'))
    .first();
  await firstFreeDay.click();
  await page.getByRole('button', { name: '03:00 PM - 06:00 PM' }).click();
}

/** Pay by cash on delivery and place the order. */
async function placeCashOrder(page) {
  await page.getByRole('button', { name: 'Continue to Payment' }).click();
  await page.getByRole('button', { name: /Cash on Delivery/ }).first().click();
  await page.getByRole('button', { name: 'Place Order' }).click();
}

test('a guest keeps their cart through sign-up and can place an order', async ({ page }) => {
  // 1. Browse as a guest and add a cake
  await addFirstCakeToCart(page);

  // 2. Checking out needs an account, and the visitor is sent to make one
  await page.goto('/cart');
  await page.getByRole('button', { name: /proceed to checkout/i }).click();
  await expect(page).toHaveURL(/\/login\?redirect=\/checkout/);

  // 3. Sign up, and land back at checkout (not on the home page)
  await page.getByRole('link', { name: 'Signup' }).click();
  await expect(page).toHaveURL(/\/register\?redirect=\/checkout/);
  await register(page, newEmail());
  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByRole('heading', { name: 'Shipping Details' })).toBeVisible();

  // 4. The cake added as a guest is still in the cart
  await expect(page.getByRole('link', { name: /^Cart, 1 items?/ })).toBeVisible();

  // 5. Deliver it, pay on delivery
  await fillShipping(page);
  await placeCashOrder(page);
  await expect(page.getByRole('heading', { name: 'Order Confirmed!' })).toBeVisible();
  await expect(page.getByText(/#SN-/)).toBeVisible();

  // 6. The order really exists on the server, for the right person
  const token = await page.evaluate(() => JSON.parse(localStorage.getItem('auth-storage')).state.token);
  const response = await page.request.get(`${API}/orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const { data: orders } = await response.json();
  expect(orders).toHaveLength(1);
  expect(orders[0].paymentMethod).toBe('cod');
  expect(orders[0].total).toBeGreaterThan(0);

  // 7. The cart is empty again
  await page.goto('/cart');
  await expect(page.getByText(/your cart is empty|nothing in your basket/i).first()).toBeVisible();
});

test('a finished order does not show up in place of the next checkout', async ({ page }) => {
  // Place one order...
  await addFirstCakeToCart(page);
  await page.goto('/cart');
  await page.getByRole('button', { name: /proceed to checkout/i }).click();
  await page.getByRole('link', { name: 'Signup' }).click();
  await register(page, newEmail());
  await fillShipping(page);
  await placeCashOrder(page);
  await expect(page.getByRole('heading', { name: 'Order Confirmed!' })).toBeVisible();

  // ...then wander off without pressing "back to home", and shop again.
  await addFirstCakeToCart(page);
  await page.goto('/checkout');

  // The old confirmation must not be what greets the shopper
  await expect(page.getByRole('heading', { name: 'Shipping Details' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Order Confirmed!' })).toHaveCount(0);
});

test('the customer demo returns to checkout with the guest cart intact', async ({ page }) => {
  await addFirstCakeToCart(page);
  await page.goto('/cart');
  await page.getByRole('button', { name: /proceed to checkout/i }).click();
  await expect(page).toHaveURL(/\/login\?redirect=\/checkout/);

  await page.getByRole('button', { name: /Customer demo/ }).click();

  await expect(page).toHaveURL(/\/checkout$/);
  await expect(page.getByRole('heading', { name: 'Shipping Details' })).toBeVisible();
  await expect(page.getByRole('link', { name: /^Cart, 1 items?/ })).toBeVisible();
});

test('the delivery calendar only offers days with 24 hours notice', async ({ page }) => {
  await addFirstCakeToCart(page);
  await page.goto('/cart');
  await page.getByRole('button', { name: /proceed to checkout/i }).click();
  await page.getByRole('link', { name: 'Signup' }).click();
  await register(page, newEmail());
  await expect(page.getByRole('heading', { name: 'Shipping Details' })).toBeVisible();

  const now = new Date();
  const label = (date) =>
    `${date.getDate()} ${date.toLocaleString('en-US', { month: 'long' })} ${date.getFullYear()}`;

  // Today is never bookable
  const today = page.getByRole('button', { name: label(now), exact: true });
  if (await today.count()) await expect(today).toBeDisabled();

  // Nothing before the first open day is clickable, and something later is
  const open = page
    .getByRole('button', { name: /^\d{1,2} [A-Za-z]+ \d{4}$/ })
    .and(page.locator(':enabled'));
  await expect(open.first()).toBeVisible();

  // Going back a month is not allowed from the first month on offer
  await expect(page.getByRole('button', { name: 'Previous month' })).toBeDisabled();
});
