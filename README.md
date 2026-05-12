# Weather Dashboard

A clean, dark-themed weather dashboard built with vanilla JS and [Open-Meteo](https://open-meteo.com) — no API key required.

## Features

- **City search** — geocodes any city name and fetches live weather data
- **Current conditions** — temperature, feels-like, humidity, wind speed, and weather icon
- **7-day forecast** — daily high/low with weather condition
- **EN / 中文** — toggle between English and Chinese; preference persists across sessions
- **Auto-restore** — last searched location reloads automatically on page refresh
- **Error handling** — clear messages for unknown cities and network failures

## Stack

- Vanilla JS (ES modules)
- [Vite](https://vitejs.dev) dev server & bundler
- Open-Meteo Geocoding API + Forecast API

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Project Structure

```
src/
├── main.js              # UI orchestration, event wiring, language state
├── formatters.js        # Pure formatting utilities (temperature, dates, WMO codes)
├── i18n.js              # English and Chinese UI strings
└── services/
    └── weatherApi.js    # All fetch() calls (geocodeCity, getWeather)
```

## Build

```bash
npm run build   # outputs to dist/
npm run preview # preview the production build locally
```
