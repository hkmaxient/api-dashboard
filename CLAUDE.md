# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # start Vite dev server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview production build locally
```

No test runner is configured.

## Architecture

Vanilla JS (ES modules) + Vite. No framework, no npm runtime dependencies.

Data flow: `main.js` orchestrates everything — it calls `weatherApi.js` for data, `formatters.js` for display values, and `i18n.js` for strings, then writes directly to the DOM.

**`src/services/weatherApi.js`** — all network I/O. Two exported async functions: `geocodeCity(name)` returns `{ name, latitude, longitude, country }` via Open-Meteo's geocoding API; `getWeather(lat, lon)` returns `{ current, daily }` from the forecast API. Errors are thrown as `new Error('LOCATION_NOT_FOUND' | 'FETCH_FAILED')` — these string codes are looked up as keys in `i18n.js` `errors` objects.

**`src/formatters.js`** — pure, stateless formatting. `getWeatherInfo(code, lang)` maps WMO weather codes to emoji + localized description. All other exports format numbers to display strings.

**`src/i18n.js`** — flat translation maps for `en` and `zh`. UI elements opt-in via `data-i18n` (textContent) or `data-i18n-placeholder` (placeholder) attributes in `index.html`; `main.js` applies them with `applyTranslations(lang)`.

**`src/main.js`** — holds the two pieces of mutable state (`currentLang`, `lastRenderData`), wires all event listeners, and manages the show/hide lifecycle of the loading spinner, error banner, and weather sections. Language changes re-render from `lastRenderData` without a new network call.

**`vite.config.js`** — sets `base: '/api-dashboard/'` for GitHub Pages deployment under that subpath. The GitHub Actions workflow deploys `dist/` to Pages on push to `main`.
