import { expect, test } from '@playwright/test';

const expectedTitle = /forthsandbox Circle POC/i;

async function readResponsePreview(response) {
  try {
    const body = await response.text();
    return body.replace(/\s+/g, ' ').trim().slice(0, 500) || '<empty body>';
  } catch (error) {
    return `<unable to read body: ${error instanceof Error ? error.message : String(error)}>`;
  }
}

test('GitHub Pages URL serves the Circle POC', async ({ page, request }, testInfo) => {
  const baseURL = testInfo.project.use.baseURL;
  const response = await request.get('./');
  const status = response.status();
  const finalUrl = response.url();
  const contentType = response.headers()['content-type'] || '<missing>';
  const bodyPreview = await readResponsePreview(response);

  await testInfo.attach('pages-http-response.json', {
    body: JSON.stringify(
      {
        configuredBaseURL: baseURL,
        finalUrl,
        status,
        statusText: response.statusText(),
        contentType,
        headers: response.headers(),
        bodyPreview,
      },
      null,
      2,
    ),
    contentType: 'application/json',
  });

  expect(
    status,
    `Expected GitHub Pages to return HTTP 200 for ${baseURL}; got ${status} ${response.statusText()} from ${finalUrl}. Body preview: ${bodyPreview}`,
  ).toBe(200);
  expect(contentType, `Expected an HTML page from ${finalUrl}; got ${contentType}.`).toContain('text/html');

  const pageResponse = await page.goto('./', { waitUntil: 'domcontentloaded' });
  expect(pageResponse, `Browser navigation to ${baseURL} did not produce a response.`).not.toBeNull();
  expect(pageResponse.status(), `Browser navigation to ${page.url()} returned HTTP ${pageResponse.status()}.`).toBe(200);

  await expect(page, `Unexpected page title at ${page.url()}.`).toHaveTitle(expectedTitle);
  await expect(page.locator('#poc-circle'), 'Expected the deployed page to render the SVG circle.').toBeVisible();
});
