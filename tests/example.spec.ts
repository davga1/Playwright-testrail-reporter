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

test('can add new test',({}) => {
  const a = 3
  expect(a).toBe(3)
})

test('can add one more test',({}) => {
  const a = 3
  expect(a).toBe(3)
})

test('can add two more tests',({}) => {
  const a = 3
  expect(a).toBe(3)
})

test('again',({}) => {
  const a = 3
  expect(a).toBe(3)
})

test('AGAIN',({}) => {
  const a = 3
  expect(a).toBe(6)
})
test('AGAIN!',({}) => {
  const a = 3
  expect(a).toBe(3)
})
test('AGAIN! ! !',({}) => {
  const a = 3
  expect(a).toBe(3)
})
test('AGAIN! ! ! ! !',({}) => {
  const a = 3
  expect(a).toBe(3)
})
test('AGAIN! ! ! ! ! ! ! !',({}) => {
  const a = 3
  expect(a).toBe(3)
})
test('12',({}) => {
  const a = 3
  expect(a).toBe(3)
})
test('13',({}) => {
  const a = 3
  expect(a).toBe(3)
})
test('14',({}) => {
  const a = 3
  expect(a).toBe(3)
})
test('15',({}) => {
  const a = 3
  expect(a).toBe(3)
})
test('16',({}) => {
  const a = 3
  expect(a).toBe(3)
})
test('17',({}) => {
  const a = 3
  expect(a).toBe(3)
})
test('18',({}) => {
  const a = 3
  expect(a).toBe(3)
})
test('19',({}) => {
  const a = 3
  expect(a).toBe(3)
})
test('20',({}) => {
  const a = 3
  expect(a).toBe(3)
})
test('21',({}) => {
  const a = 3
  expect(a).toBe(2)
})
test('22',({}) => {
  const a = 3
  expect(a).toBe(2)
})
test('23',({}) => {
  const a = 3
  expect(a).toBe(2)
})
test('24',({}) => {
  const a = 3
  expect(a).toBe(2)
})

test('25',({}) => {
  const a = 3
  expect(a).toBe(2)
})

test('26',({}) => {
  const a = 3
  expect(a).toBe(2)
})
test('27',({}) => {
  const a = 3
  expect(a).toBe(2)
})
test('28',({}) => {
  const a = 3
  expect(a).toBe(2)
})
test('29',({}) => {
  const a = 3
  expect(a).toBe(2)
})

test('30',({}) => {
  const a = 3
  expect(a).toBe(2)
})
//հիմա պետքա լինի 11 ֆեյլ ու 19 փասս

//Էստեղ գրվածա 31 հատ թեստ, 19 passed ու 12 failed


//Նոր ռան սարքվումա կախված ամսաթվից, հիմա ցույց կտամ

//Թեստերի քանակության փոխվելու դեպքում ապդեյթա անում վերջին ռանինը, ասյինքն աշխատումա ոնց որ պետքա