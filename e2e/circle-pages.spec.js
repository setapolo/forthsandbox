import { expect, test } from '@playwright/test';

async function setInputValue(page, selector, value) {
  await page.locator(selector).evaluate((input, nextValue) => {
    input.value = nextValue;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
}

async function waitForDeployedCirclePoc(page) {
  await expect
    .poll(
      async () => {
        await page.goto(`/?ready=${Date.now()}`, { waitUntil: 'networkidle' });
        return page.title();
      },
      {
        message: 'wait for deployed Circle POC page title',
        timeout: 300_000,
        intervals: [5_000],
      },
    )
    .toBe('Circle POC');
}

test('deployed Circle POC renders and responds to controls', async ({ page }) => {
  await waitForDeployedCirclePoc(page);

  await expect(page.locator('#circle-stage')).toHaveCount(1);

  const circle = page.locator('#poc-circle');
  await expect(circle).toHaveCount(1);
  await expect(circle).toHaveAttribute('r', '72');
  await expect(circle).toHaveAttribute('fill', '#2563eb');

  await setInputValue(page, '#radius-control', '96');
  await expect(circle).toHaveAttribute('r', '96');

  await setInputValue(page, '#color-control', '#dc2626');
  await expect(circle).toHaveAttribute('fill', '#dc2626');
});
