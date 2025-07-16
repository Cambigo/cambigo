import { test, expect } from '@playwright/test';

// Environment variables - MANDATORY (as per test plan)
const TEST_URL = process.env.TEST_CAMBIGO_FLOW_URL || 'https://dev.cambigo.io';
const TEST_USER = process.env.TEST_CAMBIGO_FLOW_USER || '';
const TEST_PASSWORD = process.env.TEST_CAMBIGO_FLOW_PASSWORD || '';

test.describe('Cambigo Dashboard Testing Plan v1.0', () => {
  test.describe('Environment Setup Verification', () => {
    test('should have required environment variables configured', async ({ page }) => {
      // Verify environment variables are set (not their values)
      expect(TEST_URL).toBeTruthy();
      expect(TEST_USER).toBeTruthy();
      expect(TEST_PASSWORD).toBeTruthy();
    });
  });

  test.describe('Login Flow Requirements', () => {
    test('should verify page title and sign in button', async ({ page }) => {
      await page.goto(TEST_URL);
      
      // Verify page title is "Cambigo Flow"
      await expect(page).toHaveTitle('Cambigo Flow');
      
      // Verify "Sign in" button exists
      const signInButton = page.getByRole('button', { name: /sign in/i });
      await expect(signInButton).toBeVisible();
    });

    test('should redirect to clerk.com on sign in', async ({ page }) => {
      await page.goto(TEST_URL);
      
      // Click "Sign in" button
      const signInButton = page.getByRole('button', { name: /sign in/i });
      await signInButton.click();
      
      // Verify redirect to clerk.com
      await expect(page).toHaveURL(/.*clerk\.com.*|.*accounts\.dev.*/);
    });

    test('should complete login flow and click Build A Flow', async ({ page }) => {
      await page.goto(TEST_URL);
      
      // Click "Sign in" button
      const signInButton = page.getByRole('button', { name: /sign in/i });
      await signInButton.click();
      
      // Wait for redirect to clerk auth page
      await page.waitForURL(/.*(?:clerk|accounts)\..*/, { timeout: 10000 });
      await page.waitForLoadState('networkidle');
      
      // Fill credentials
      await page.fill('input[name="identifier"]', TEST_USER);
      await page.fill('input[name="password"]', TEST_PASSWORD);
      
      // Click Continue to submit
      await page.getByRole('button', { name: /continue/i }).click();
      
      // After successful login, click "Build A Flow!"
      await page.waitForLoadState('networkidle');
      const buildFlowButton = page.getByRole('button', { name: /build a flow/i });
      await buildFlowButton.waitFor({ state: 'visible', timeout: 10000 });
      await buildFlowButton.click();
      
      // Verify redirect to main application
      await page.waitForURL(/.*\/(flow|dashboard)/, { timeout: 15000 });
    });
  });

  test.describe('Dashboard Header Verification', () => {
    test.beforeEach(async ({ page }) => {
      // Complete login flow
      await page.goto(TEST_URL);
      const signInButton = page.getByRole('button', { name: /sign in/i });
      await signInButton.click();
      await page.waitForURL(/.*(?:clerk|accounts)\..*/, { timeout: 10000 });
      await page.waitForLoadState('networkidle');
      await page.fill('input[name="identifier"]', TEST_USER);
      await page.fill('input[name="password"]', TEST_PASSWORD);
      await page.getByRole('button', { name: /continue/i }).click();
      await page.waitForLoadState('networkidle');
      const buildFlowButton = page.getByRole('button', { name: /build a flow/i });
      await buildFlowButton.waitFor({ state: 'visible', timeout: 10000 });
      await buildFlowButton.click();
      await page.waitForURL(/.*\/(flow|dashboard)/, { timeout: 15000 });
    });

    test('should display required header buttons', async ({ page }) => {
      // Verify Dashboard button
      await expect(page.getByRole('button', { name: /dashboard/i })).toBeVisible();
      
      // Verify Editor button
      await expect(page.getByRole('button', { name: /editor/i })).toBeVisible();
      
      // Verify Document button
      await expect(page.getByRole('button', { name: /document/i })).toBeVisible();
      
      // Verify Sharing button
      await expect(page.getByRole('button', { name: /sharing/i })).toBeVisible();
    });

    test('should have Sharing button disabled in Dashboard view', async ({ page }) => {
      // Verify Sharing button is disabled when in Dashboard view
      const sharingButton = page.getByRole('button', { name: /sharing/i });
      await expect(sharingButton).toBeDisabled();
    });
  });

  test.describe('Card Components Verification', () => {
    test.beforeEach(async ({ page }) => {
      // Complete login flow
      await page.goto(TEST_URL);
      const signInButton = page.getByRole('button', { name: /sign in/i });
      await signInButton.click();
      await page.waitForURL(/.*(?:clerk|accounts)\..*/, { timeout: 10000 });
      await page.waitForLoadState('networkidle');
      await page.fill('input[name="identifier"]', TEST_USER);
      await page.fill('input[name="password"]', TEST_PASSWORD);
      await page.getByRole('button', { name: /continue/i }).click();
      await page.waitForLoadState('networkidle');
      const buildFlowButton = page.getByRole('button', { name: /build a flow/i });
      await buildFlowButton.waitFor({ state: 'visible', timeout: 10000 });
      await buildFlowButton.click();
      await page.waitForURL(/.*\/(flow|dashboard)/, { timeout: 15000 });
    });

    test('should display default Card components', async ({ page }) => {
      // Verify Card components are present
      const cards = page.locator('[data-testid*="card"], .card, [class*="card"]');
      await expect(cards.first()).toBeVisible();
    });

    test('should verify Create New Online Flow Card requirements', async ({ page }) => {
      // Solid blue "Create Online Flow" button
      const createOnlineButton = page.locator('button:has-text("Create Online Flow")');
      await expect(createOnlineButton).toBeVisible();
      
      // Verify solid blue background (not outline)
      await expect(createOnlineButton).toHaveCSS('background-color', /rgb\(59, 130, 246\)|rgb\(37, 99, 235\)|#3b82f6|#2563eb/);
      
      // Outline blue "Import a Flow" button
      const importButton = page.locator('button:has-text("Import a Flow")').first();
      await expect(importButton).toBeVisible();
      
      // Verify outline style (light blue background with blue border)
      await expect(importButton).toHaveCSS('background-color', /rgb\(191, 219, 254\)|rgb\(219, 234, 254\)|#bfdbfe|#dbeafe/);
      await expect(importButton).toHaveCSS('border-color', /rgb\(59, 130, 246\)|rgb\(37, 99, 235\)|rgb\(191, 219, 254\)|#3b82f6|#2563eb|#bfdbfe/);
      
      // Gray dashed border on card
      const onlineCard = page.locator('*:has(button:has-text("Create Online Flow"))').first();
      await expect(onlineCard).toHaveCSS('border-style', 'dashed');
      await expect(onlineCard).toHaveCSS('border-color', /gray|rgb\(156, 163, 175\)|rgb\(107, 114, 128\)|#9ca3af|#6b7280/);
      
      // Green hover highlights
      await createOnlineButton.hover();
      await page.waitForTimeout(100);
      await expect(createOnlineButton).toHaveCSS('background-color', /rgb\(34, 197, 94\)|rgb\(22, 163, 74\)|#22c55e|#16a34a/);
      
      // Flow usage tracker (e.g., "1 of 10 flows")
      const usageText = page.locator('text=/\d+ of \d+ flows/');
      await expect(usageText).toBeVisible();
    });

    test('should verify Create New Offline Flow Card requirements', async ({ page }) => {
      // Solid blue "Create Offline Flow" button
      const createOfflineButton = page.locator('button:has-text("Create Offline Flow")');
      await expect(createOfflineButton).toBeVisible();
      
      // Verify solid blue background (not outline)
      await expect(createOfflineButton).toHaveCSS('background-color', /rgb\(59, 130, 246\)|rgb\(37, 99, 235\)|#3b82f6|#2563eb/);
      
      // Outline blue "Import a Flow" button
      const importButton = page.locator('button:has-text("Import a Flow")').nth(1);
      await expect(importButton).toBeVisible();
      
      // Verify outline style (light blue background with blue border)
      await expect(importButton).toHaveCSS('background-color', /rgb\(191, 219, 254\)|rgb\(219, 234, 254\)|#bfdbfe|#dbeafe/);
      await expect(importButton).toHaveCSS('border-color', /rgb\(59, 130, 246\)|rgb\(37, 99, 235\)|rgb\(191, 219, 254\)|#3b82f6|#2563eb|#bfdbfe/);
      
      // Gray dashed border on card
      const offlineCard = page.locator('*:has(button:has-text("Create Offline Flow"))').first();
      await expect(offlineCard).toHaveCSS('border-style', 'dashed');
      await expect(offlineCard).toHaveCSS('border-color', /gray|rgb\(156, 163, 175\)|rgb\(107, 114, 128\)|#9ca3af|#6b7280/);
      
      // Red hover highlights
      await createOfflineButton.hover();
      await page.waitForTimeout(100);
      await expect(createOfflineButton).toHaveCSS('background-color', /rgb\(239, 68, 68\)|rgb\(220, 38, 38\)|#ef4444|#dc2626/);
      
      // Flow usage tracker (e.g., "1 of 10 flows")
      const usageText = page.locator('text=/\d+ of \d+ flows/');
      await expect(usageText).toBeVisible();
    });
  });

  test.describe('Flow Creation Validation', () => {
    test.beforeEach(async ({ page }) => {
      // Complete login flow
      await page.goto(TEST_URL);
      const signInButton = page.getByRole('button', { name: /sign in/i });
      await signInButton.click();
      await page.waitForURL(/.*(?:clerk|accounts)\..*/, { timeout: 10000 });
      await page.waitForLoadState('networkidle');
      await page.fill('input[name="identifier"]', TEST_USER);
      await page.fill('input[name="password"]', TEST_PASSWORD);
      await page.getByRole('button', { name: /continue/i }).click();
      await page.waitForLoadState('networkidle');
      const buildFlowButton = page.getByRole('button', { name: /build a flow/i });
      await buildFlowButton.waitFor({ state: 'visible', timeout: 10000 });
      await buildFlowButton.click();
      await page.waitForURL(/.*\/(flow|dashboard)/, { timeout: 15000 });
    });

    test('should create Online Flow and verify new flow card appears', async ({ page }) => {
      // Count existing flow cards before creation
      const existingFlowCards = page.locator('text=/Online Flow|Offline Flow/');
      const initialCount = await existingFlowCards.count();
      
      // Click "Create Online Flow" button
      const createOnlineButton = page.locator('button:has-text("Create Online Flow")');
      await createOnlineButton.click();
      
      // Verify a new flow card appears (count increased)
      await expect(existingFlowCards).toHaveCount(initialCount + 1, { timeout: 10000 });
    });

    test('should create Offline Flow and verify new flow card appears', async ({ page }) => {
      // Count existing flow cards before creation
      const existingFlowCards = page.locator('text=/Online Flow|Offline Flow/');
      const initialCount = await existingFlowCards.count();
      
      // Click "Create Offline Flow" button
      const createOfflineButton = page.locator('button:has-text("Create Offline Flow")');
      await createOfflineButton.click();
      
      // Verify a new flow card appears (count increased)
      await expect(existingFlowCards).toHaveCount(initialCount + 1, { timeout: 10000 });
    });
  });
});