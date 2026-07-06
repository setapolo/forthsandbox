# forthsandbox Circle POC

This repository currently contains a small HTML/JavaScript proof of concept that draws an SVG circle and lets you change its radius and color.

## Run locally

Start a local web server from the repository root:

```sh
npm run serve
```

Then open:

```text
http://127.0.0.1:8000/
```

## Check on a real device

Use this when you want to verify the UI on a phone, tablet, or another machine on the same network.

1. Connect the development machine and the real device to the same network.
2. Start the server so it listens on the LAN interface:

   ```sh
   npm run serve:lan
   ```

3. Find the development machine's local IP address:

   ```sh
   hostname -I
   ```

4. On the real device, open the first IP address from that command with port `8000`.

   For example:

   ```text
   http://192.168.1.23:8000/
   ```

5. Confirm the following manually:

   - The page loads without a browser error.
   - A circle is visible in the SVG stage.
   - Moving the radius slider changes the circle size.
   - Changing the color picker changes the circle fill color.
   - The layout remains usable on the device's screen size.

## GitHub Actions smoke test idea

A small deployment smoke test is a good next PR target: deploy the static files to GitHub Pages, wait until the deployed page contains the expected Circle POC markers, and then run the Playwright check against the deployed URL.

This repository already has the pieces needed for that flow:

- `.github/workflows/pages-e2e.yml` deploys the static files to GitHub Pages and runs the deployed-page E2E check.
- `npm run smoke:pages` waits for the configured Pages URL and then runs Playwright against it.
- `npm run smoke:local` runs the same Playwright check against `http://127.0.0.1:8000/`, which is useful when Codex starts `npm run serve` in another terminal and wants to verify the deployment-like behavior locally.

For a minimal Codex-only check before relying on GitHub Pages, run these in two terminals:

```sh
npm run serve
```

```sh
npm run smoke:local
```

## Automated checks

Run the dependency-free Node test suite:

```sh
npm test
```

The test suite verifies that JavaScript creates the expected SVG circle attributes and that the radius/color update helpers change the circle state.
