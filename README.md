# Luggage Carousel

A Next.js static-export example of an airport luggage carousel.

## Features

- Infinite left-to-right luggage carousel
- Virtualized belt rendering: only luggage visible in the belt viewport is mounted
- Mouse and touch drag/drop from carousel into a 3x3 storage area
- Dotted priority front row
- `unload` drains storage in priority LIFO order first, then normal LIFO order

## Run Locally

```sh
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Verify

```sh
npm run check
npm test
npm run build
```

## Project Structure

- `app/page.tsx` holds the main app state and event handlers.
- `components/` has the visible UI parts.
- `lib/` has the carousel and storage rules.
- `tests/` has small regression tests for the rules.
- `scripts/validate.ts` checks the assignment requirements.

## Publish

The source lives on `main`. GitHub Pages serves the generated static export from the
`gh-pages` branch.
