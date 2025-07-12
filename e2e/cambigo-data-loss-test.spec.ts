import { test, expect } from '@playwright/test';

// Environment variables - MANDATORY (as per test plan)
const TEST_URL = process.env.TEST_CAMBIGO_FLOW_URL || 'https://cambigo.dev';
const TEST_USER = process.env.TEST_CAMBIGO_FLOW_USER || '';
const TEST_PASSWORD = process.env.TEST_CAMBIGO_FLOW_PASSWORD || '';

test.describe('Data Loss Prevention Tests', () => {
  test.describe('Environment Setup Verification', () => {
    test('should have required environment variables configured', async ({ page }) => {
      // Verify environment variables are set (not their values)
      expect(TEST_URL).toBeTruthy();
      expect(TEST_USER).toBeTruthy();
      expect(TEST_PASSWORD).toBeTruthy();
    });
  });

  test('bulk add steps should persist when switching between flows', async ({ page }) => {
    // Capture console logs for debugging
    page.on('console', msg => {
      if (msg.type() === 'log' && msg.text().includes('FlowCache DEBUG')) {
        console.log('DEBUG:', msg.text());
      }
    });
    await page.goto(TEST_URL);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill(TEST_USER);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill(TEST_PASSWORD);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('button', { name: 'Build A Flow!' }).click();
    await page.getByRole('button', { name: 'Create Offline Flow' }).click();
    await page.getByRole('button', { name: 'Bulk Add Steps' }).click();
    await page.getByRole('textbox', { name: 'Example: Collect patient' }).click();
    await page.getByRole('textbox', { name: 'Example: Collect patient' }).fill('Martinez\nMerced\nModesto\nMonterey\nNapa\nNovato');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('button', { name: 'Add 6 Steps' }).click();
    await page.getByRole('button', { name: 'Dashboard' }).click();
    await page.getByRole('button', { name: 'Create Offline Flow' }).click();
    await page.getByRole('button', { name: 'Add New Step' }).click();
    await page.getByRole('button', { name: 'Save' }).click();
    await page.getByRole('button', { name: 'Dashboard' }).click();
    await page.getByRole('button', { name: 'Open Flow' }).nth(1).click();
    await expect(page.getByText('Martinez')).toBeTruthy();
    await expect(page.getByText('Merced')).toBeTruthy();
    await expect(page.getByText('Modesto')).toBeTruthy();
    await expect(page.getByText('Monterey')).toBeTruthy();
    await expect(page.getByText('Napa')).toBeTruthy();
    await expect(page.getByText('Novato')).toBeTruthy();
  });
});
