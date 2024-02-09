import { test, expect } from '@playwright/test';


test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('1', () => {
  expect(1).toBe(1)
})
test('2', () => {
  expect(1).toBe(2)
})
test('3', () => {
  expect(1).toBe(1)
})
test('4', () => {
  expect(1).toBe(4)
})
test('5', () => {
  expect(1).toBe(1)
})