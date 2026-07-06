const url = process.env.E2E_BASE_URL || 'https://setapolo.github.io/forthsandbox/';
const timeoutMs = Number(process.env.PAGES_READY_TIMEOUT_MS || 300000);
const intervalMs = Number(process.env.PAGES_READY_INTERVAL_MS || 5000);
const previewLength = Number(process.env.PAGES_READY_BODY_PREVIEW_LENGTH || 300);

function cacheBustedUrl(rawUrl) {
  const nextUrl = new URL(rawUrl);
  nextUrl.searchParams.set('ready', String(Date.now()));
  return nextUrl;
}

async function describeResponse(response) {
  const contentType = response.headers.get('content-type') || '<missing>';
  let bodyPreview = '<unread>';

  try {
    bodyPreview = (await response.text()).replace(/\s+/g, ' ').trim().slice(0, previewLength) || '<empty body>';
  } catch (error) {
    bodyPreview = `<unable to read body: ${error instanceof Error ? error.message : String(error)}>`;
  }

  return `HTTP ${response.status} ${response.statusText}; content-type=${contentType}; body-preview=${JSON.stringify(bodyPreview)}`;
}

const startedAt = Date.now();
let lastError = '';
let attempt = 0;

while (Date.now() - startedAt < timeoutMs) {
  attempt += 1;
  const readyUrl = cacheBustedUrl(url);

  try {
    const response = await fetch(readyUrl, { cache: 'no-store', redirect: 'follow' });
    const details = await describeResponse(response);

    if (response.ok) {
      console.log(`Pages deployment is ready after ${attempt} attempt(s): ${details}; url=${url}; checked=${readyUrl}`);
      process.exit(0);
    }

    lastError = details;
  } catch (error) {
    lastError = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  }

  console.log(`Waiting for Pages deployment at ${url} (attempt ${attempt}): ${lastError}`);
  await new Promise((resolve) => setTimeout(resolve, intervalMs));
}

console.error(`Timed out after ${attempt} attempt(s) waiting for Pages deployment at ${url}: ${lastError}`);
process.exit(1);
