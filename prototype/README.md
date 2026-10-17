# Craigslist redesign prototype

Exploration prototype for the Livefront design challenge (Android, Material 3, Minneapolis mock data).

- `npm install` then `npm run dev` for a live dev server (`--host` so you can open it on a phone on the same network)
- `npm run build` writes a single self-contained `dist/index.html` (plus `dist/artifact.html` for publishing)

Built: (a) Home, (b) category list, (c) search, (d) listing detail. On desktop a side panel jumps between screens and switches light/dark. Home directions B and C were explored and dropped in favor of A (see git history).

Bike photos in `src/assets/photos/` are cropped from the audit screenshots as stand-ins. Replace them with licensed stock before anything is shared outside the team.
