import 'dotenv/config';
import { test, expect } from '@playwright/test';

// Gate: only run against a test branch, never prod.
const TEST_URL = process.env.DATABASE_URL_TEST;
const run = !!TEST_URL;

test.afterAll(async () => {
  if (!TEST_URL) return;
  const { neon } = await import('@neondatabase/serverless');
  const { drizzle } = await import('drizzle-orm/neon-http');
  const { sql } = await import('drizzle-orm');
  const client = drizzle({ client: neon(TEST_URL) });
  await client.execute(
    sql`DELETE FROM subscribers WHERE email LIKE 'it-%@example.com'`,
  );
});

test.describe('Frontend test', () => {
  test('Displays page UI', async ({ page }) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Mystery Page' }),
    ).toBeVisible();
    await expect(page.getByLabel('Enter your Email')).toBeVisible();
    await expect(
      page.getByRole('button', { name: 'I want to know!' }),
    ).toBeVisible();
  });
});

(run ? test.describe : test.describe.skip)('Frontend + Backend tests', () => {
  test('Subscribe new mail -> success message', async ({ page }) => {
    const email = `it-${Date.now()}@example.com`;
    await page.goto('/');
    await page.getByLabel('Enter your Email').fill(email);
    await page.getByRole('button', { name: 'I want to know!' }).click();
    await expect(page.getByText('Successfully subscribed')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator('#email')).toHaveValue('');
  });
});
