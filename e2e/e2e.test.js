import 'dotenv/config';
import { test, expect } from '@playwright/test';

// Gate: only run against a test branch, never prod.
const TEST_URL = process.env.DATABASE_URL_TEST;
const run = !!TEST_URL;

(run ? test.describe : test.describe.skip)('Frontend + Backend tests', () => {
  test('Subscribe new mail -> success message', async ({ page }) => {
    const email = `it-${Date.now()}@example.com`;
    await page.goto('/');
    await page.getByLabel('Enter your Email').fill(email);
    await page.getByRole('button', { name: 'I want to know!' }).click();
    await expect(page.getByText('Successfully subscribed')).toBeVisible();
    await expect(page.locator('#email')).toHaveValue('');
  });
  test('Subscribe used mail -> error message', async ({ page }) => {
    const email = `it-${Date.now()}-${Math.round(Math.random() * 1e6)}@example.com`;
    await page.goto('/');
    await page.getByLabel('Enter your Email').fill(email);
    await page.getByRole('button', { name: 'I want to know!' }).click();
    await expect(page.getByText('Successfully subscribed')).toBeVisible();
    await expect(page.locator('#email')).toHaveValue('');
    await page.getByLabel('Enter your Email').fill(email);
    await page.getByRole('button', { name: 'I want to know!' }).click();
    await expect(page.getByText('Already subscribed')).toBeVisible();
  });
  test('Subscribe invalid email -> cant submit + email stays in input', async ({
    page,
  }) => {
    const email = 'invalidEmail';
    await page.goto('/');
    await page.getByLabel('Enter your Email').fill(email);
    await page.getByRole('button', { name: 'I want to know!' }).click();
    await expect(page.locator('#email')).toHaveValue(email);
  });
  test('Subscribe email while server error -> error message', async ({
    page,
  }) => {
    // Force status 500 on backend
    await page.route('**/api/subscribers', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'An error ocurred' }),
      }),
    );
    await page.goto('/');
    await page
      .getByLabel('Enter your Email')
      .fill(`it-${Date.now()}@example.com`);
    await page.getByRole('button', { name: 'I want to know!' }).click();
    await expect(
      page.getByText('Something went wrong. Please try again later.'),
    ).toBeVisible();
  });
});
