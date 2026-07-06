const url = process.env.E2E_BASE_URL || 'https://setapolo.github.io/forthsandbox/';
const timeoutMs = Number(process.env.PAGES_READY_TIMEOUT_MS || 300000);
const intervalMs = Number(process.env.PAGES_READY_INTERVAL_MS || 5000);
const requiredMarkers = [
  '<title>Circle POC</title>',
  'id="circle-stage"',
  'src="main.js"',
];

const startedAt = Date.now();
let lastError = '';

while (Date.now() - startedAt < timeoutMs) {
  try {
    const response = await fetch(url, { cache: 'no-store' });
    const body = await response.text();

    if (!response.ok) {
      lastError = `HTTP ${response.status}`;
    } else {
      const missing = requiredMarkers.filter((marker) => !body.includes(marker));

      if (missing.length === 0) {
        console.log(`Pages deployment is ready: ${url}`);
        process.exit(0);
      }

      lastError = `missing markers: ${missing.join(', ')}`;
    }
  } catch (error) {
    lastError = error instanceof Error ? error.message : String(error);
  }

  console.log(`Waiting for Pages deployment at ${url}: ${lastError}`);
  await new Promise((resolve) => setTimeout(resolve, intervalMs));
}

console.error(`Timed out waiting for Pages deployment at ${url}: ${lastError}`);
process.exit(1);
