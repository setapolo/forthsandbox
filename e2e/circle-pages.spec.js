import { expect, test } from '@playwright/test';

test('GitHub Pages URL returns HTTP 200', async ({ request }) => {
  const response = await request.get('/');

  expect(response.status()).toBe(200);
});
