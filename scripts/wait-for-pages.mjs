const url = process.env.E2E_BASE_URL || 'https://setapolo.github.io/forthsandbox/';
const timeoutMs = Number(process.env.PAGES_READY_TIMEOUT_MS || 300000);
const intervalMs = Number(process.env.PAGES_READY_INTERVAL_MS || 5000);

function cacheBustedUrl(rawUrl) {
  const nextUrl = new URL(rawUrl);
  nextUrl.searchParams.set('ready', String(Date.now()));
  return nextUrl;
}

const startedAt = Date.now();
let lastError = '';

while (Date.now() - startedAt < timeoutMs) {
  try {
    const response = await fetch(cacheBustedUrl(url), { cache: 'no-store' });

    if (response.ok) {
      console.log(`Pages deployment returned HTTP ${response.status}: ${url}`);
      process.exit(0);
    }

    lastError = `HTTP ${response.status}`;
  } catch (error) {
    lastError = error instanceof Error ? error.message : String(error);
  }

  console.log(`Waiting for Pages deployment at ${url}: ${lastError}`);
  await new Promise((resolve) => setTimeout(resolve, intervalMs));
}

console.error(`Timed out waiting for Pages deployment at ${url}: ${lastError}`);
process.exit(1);
