# Vibemood

A premium music web app (frontend only).

## Stack
- Vite + React + TypeScript + Tailwind CSS + React Router + lucide-react
- State: React context + localStorage

## Run
```
npm install
npm run dev
npm run build
```

## Debug theme
Press Ctrl+Shift+D to open debug panel with hour slider.

## Production replacement notes
- Auth: replace mock AuthContext with Supabase auth (email/password + OAuth). Keep the same context shape.
- New-release feeds: replace static `isNew` flags / New page data with fetches from YouTube channel RSS (or your backend). Update `src/data/songs.ts` loader.
- Player: plug YouTube IFrame Player API into the adapter point in `src/context/PlayerContext.tsx` (see `adapter` ref). Swap simulated timer for iframe events.
- Lyrics: replace placeholder timed lyrics in `src/data/lyrics.ts` with licensed lyrics API (register adapter in `src/components/LyricsFull.tsx`).