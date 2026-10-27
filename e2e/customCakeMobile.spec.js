// The 3D cake designer on phones: the panel under the cake must scroll inside itself and keep Previous / Next and the
// total in view (it used to be clipped, so the Next button could not be reached), and nothing is downloaded from a
// third-party server just to light the cake.
import { test, expect } from '@playwright/test';

const PHONES = [
  { name: 'iPhone 12', width: 390, height: 844 },
  { name: 'small Android', width: 360, height: 640 },
  { name: 'iPhone SE', width: 320, height: 568 },
  { name: 'phone on its side', width: 844, height: 390 },
];

async function openDesigner(page) {
  await page.goto('/custompage');
  await page.getByRole('button', { name: /Start Designing/ }).click();
  await page.waitForSelector('canvas', { timeout: 30_000 });
}

for (const phone of PHONES) {
  test(`${phone.name}: Previous, Next and the total stay in view, and the options scroll`, async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: phone.width, height: phone.height },
      hasTouch: true,
      isMobile: true,
    });
    const page = await context.newPage();
    await openDesigner(page);

    const next = page.getByRole('button', { name: /^Next:/ });
    await expect(next).toBeVisible();
    const box = await next.boundingBox();
    expect(box.y + box.height).toBeLessThanOrEqual(phone.height);
    await expect(page.getByText(/^Total/)).toBeVisible();

    // the options area has its own scroll bar and can reach its last option
    const scroller = page.locator('aside > div.overflow-y-auto');
    const { scrollHeight, clientHeight } = await scroller.evaluate((el) => ({ scrollHeight: el.scrollHeight, clientHeight: el.clientHeight }));
    expect(clientHeight).toBeGreaterThan(80);
    if (scrollHeight > clientHeight) {
      await scroller.evaluate((el) => el.scrollTo(0, el.scrollHeight));
      expect(await scroller.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    }

    // the step buttons work from where they are
    await next.click();
    await expect(page.locator('aside h2')).toContainText(/flavor|filling|sponge/i);
    await context.close();
  });
}

test('lighting the cake does not download an HDR picture from another site', async ({ page }) => {
  const outside = [];
  page.on('request', (request) => {
    if (/\.(hdr|exr)(\?|$)/i.test(request.url()) || /hdri/i.test(request.url())) outside.push(request.url());
  });
  await openDesigner(page);
  await page.waitForTimeout(1500);
  expect(outside).toEqual([]);
});

test('the designer code is only downloaded when someone opens it', async ({ page }) => {
  const chunks = [];
  page.on('request', (request) => {
    if (/CakeConfigurator-.*\.js/.test(request.url())) chunks.push(request.url());
  });
  await page.goto('/custompage');
  await page.waitForLoadState('networkidle');
  expect(chunks).toEqual([]);
  await page.getByRole('button', { name: /Start Designing/ }).click();
  await page.waitForSelector('canvas', { timeout: 30_000 });
  expect(chunks.length).toBe(1);
});
