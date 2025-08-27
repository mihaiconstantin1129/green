import { test, expect } from '@playwright/test';

test('article page has og tags', async ({ page }) => {
  await page.goto('/stiri/test-2');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Test Article/);
});

test('category page has canonical link', async ({ page }) => {
  await page.goto('/categorie/energie-verde');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /energie-verde/);
});
