import { expect, test } from '@playwright/test';

test('GitHub Pages URL returns HTTP 200', async ({ request }, testInfo) => {
  const response = await request.get('/', { failOnStatusCode: false });
  const body = await response.text().catch((error) => `Unable to read response body: ${error}`);
  const diagnostics = JSON.stringify(
    {
      url: response.url(),
      status: response.status(),
      statusText: response.statusText(),
      headers: response.headers(),
      bodySnippet: body.slice(0, 1_000),
    },
    null,
    2,
  );

  console.log(diagnostics);
  await testInfo.attach('http-200-diagnostics.json', {
    body: diagnostics,
    contentType: 'application/json',
  });

  expect(response.status(), diagnostics).toBe(200);
});
