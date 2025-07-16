import { test, expect } from '@playwright/test';

// Environment variables - MANDATORY (as per test plan)
const TEST_URL = process.env.TEST_CAMBIGO_FLOW_URL || 'https://dev.cambigo.io';
const TEST_USER = process.env.TEST_CAMBIGO_FLOW_USER || '';
const TEST_PASSWORD = process.env.TEST_CAMBIGO_FLOW_PASSWORD || '';

test.describe('Can Create and Delete and Online Flow', () => {
    test('test', async ({ page }) => {
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
        await page.getByRole('button', { name: 'Create Online Flow' }).click();

        await page.getByRole('button', { name: 'Open Flow' }).first().click();
        await page.locator('#flow-title').click();
        await page.getByRole('textbox').fill('My Test Flow');
        await page.getByRole('textbox').press('Enter');
        await expect(page.getByRole('heading', { name: 'My Test FlowClick to Edit' })).toBeVisible();

        await page.getByRole('button', { name: 'Add New Step' }).click();
        await page.getByRole('textbox', { name: 'Title' }).click();
        await page.getByRole('textbox', { name: 'Title' }).fill('My First Step Is This One');
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText('My First Step Is This One').first()).toBeVisible();

        await page.getByRole('button', { name: 'Dashboard' }).click();
        await expect(page.getByText('My Test FlowOnline').first()).toBeVisible();
        await page.getByRole('button', { name: 'Delete' }).first().click();
        await page.getByRole('button', { name: 'Delete' }).click();
    });
});