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

## Automated checks

Run the dependency-free Node test suite:

```sh
npm test
```

The test suite verifies that JavaScript creates the expected SVG circle attributes and that the radius/color update helpers change the circle state.
