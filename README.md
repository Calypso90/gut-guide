# ReliefMap — Vite + React + TypeScript scaffold

This repository is a minimal starter scaffold for ReliefMap using Vite, React, TypeScript, Tailwind CSS and React Router. It includes a small folder structure and components to get you started.

Requirements

- Node 18+ (recommended)
- npm or pnpm

Install

Using npm:

```bash
npm install
npm run dev
```

Using pnpm:

```bash
pnpm install
pnpm dev
```

Build

```bash
npm run build
npm run preview
```

File layout

The important files created for you are (paths relative to project root):

- `index.html` - Vite entry
- `src/main.tsx` - app bootstrap and router
- `src/App.tsx` - route definitions and layout
- `src/index.css` - Tailwind entry
- `src/pages` - simple page placeholders
- `src/components` - Header and Footer

Absolute imports

This project configures a path alias `src/*` so you can import using absolute-style imports like:

```ts
import Home from "src/pages/Home";
```

Environment variables

You can provide environment variables via a `.env` file (Vite will only expose variables prefixed with `VITE_`). Example variables you might use in ReliefMap:

- `VITE_GOOGLE_MAPS_KEY` — API key for Google Maps. Use it in client code via `import.meta.env.VITE_GOOGLE_MAPS_KEY`.
- `VITE_FIREBASE_CONFIG` — A JSON stringified Firebase config object (if using Firebase). You can store the entire config as a JSON string or add individual keys like `VITE_FIREBASE_API_KEY`.

Example `.env` (do NOT commit keys to source control):

```
VITE_GOOGLE_MAPS_KEY=your_key_here
VITE_FIREBASE_CONFIG={"apiKey":"...","authDomain":"..."}
```

Notes

- After running `npm install`, run `npm run dev` to start the development server.
- Tailwind is configured in `tailwind.config.cjs` and PostCSS is configured in `postcss.config.cjs`.
- This scaffold intentionally keeps auth and map providers out of the core so you can plug in your preferred provider.

Next steps

- Replace the map placeholder in `src/pages/Home.tsx` with a map component (Google Maps, Mapbox, Leaflet).
- Add auth logic to `src/pages/Auth.tsx` (Firebase, Auth0, or your own API).
- Add unit tests and CI as needed.
# gut-guide
