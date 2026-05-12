import * as weatherApi from './services/weatherApi.js'
import {
  formatTemperature,
  formatWindSpeed,
  formatHumidity,
  formatDay,
  getWeatherInfo,
} from './formatters.js'
import { translations } from './i18n.js'

const searchInput = document.getElementById('search-input')
const searchBtn = document.getElementById('search-btn')
const errorMessage = document.getElementById('error-message')
const loadingSpinner = document.getElementById('loading-spinner')
const currentWeather = document.getElementById('current-weather')
const forecastSection = document.getElementById('forecast-section')
const forecastGrid = document.getElementById('forecast-grid')

// ── State ────────────────────────────────────────────────────────────────────

let currentLang = 'en'
let lastRenderData = null  // { current, daily, locationName, country }

// ── Storage ──────────────────────────────────────────────────────────────────

const storage = {
  LOCATION_KEY: 'weather_last_location',
  LANG_KEY: 'weather_lang',
  saveLocation(name, latitude, longitude, country) {
    try {
      localStorage.setItem(this.LOCATION_KEY, JSON.stringify({ name, latitude, longitude, country }))
    } catch (_) {}
  },
  getLocation() {
    try {
      const raw = localStorage.getItem(this.LOCATION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch (_) {
      return null
    }
  },
  saveLang(lang) {
    try { localStorage.setItem(this.LANG_KEY, lang) } catch (_) {}
  },
  getLang() {
    try { return localStorage.getItem(this.LANG_KEY) ?? 'en' } catch (_) { return 'en' }
  },
}

// ── i18n ─────────────────────────────────────────────────────────────────────

function applyTranslations(lang) {
  const t = translations[lang]
  document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en'

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n
    if (t[key] !== undefined) el.textContent = t[key]
  })
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.dataset.i18nPlaceholder
    if (t[key] !== undefined) el.placeholder = t[key]
  })

  document.querySelectorAll('.lang-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lang === lang)
  })
}

function setLang(lang) {
  currentLang = lang
  storage.saveLang(lang)
  applyTranslations(lang)
  if (lastRenderData) {
    renderCurrentConditions(lastRenderData.current, lastRenderData.locationName, lastRenderData.country)
    renderForecast(lastRenderData.daily)
  }
}

// ── Loading / error ───────────────────────────────────────────────────────────

function showLoading() {
  loadingSpinner.classList.remove('hidden')
  currentWeather.classList.add('hidden')
  forecastSection.classList.add('hidden')
  errorMessage.classList.add('hidden')
}

function hideLoading() {
  loadingSpinner.classList.add('hidden')
}

function showError(err) {
  const t = translations[currentLang].errors
  const msg = t[err.message] ?? t.DEFAULT
  errorMessage.textContent = msg
  errorMessage.classList.remove('hidden')
  currentWeather.classList.add('hidden')
  forecastSection.classList.add('hidden')
}

// ── Render ────────────────────────────────────────────────────────────────────

function renderCurrentConditions(current, locationName, country) {
  const { emoji, description } = getWeatherInfo(current.weather_code, currentLang)
  document.getElementById('location-name').textContent =
    country ? `${locationName}, ${country}` : locationName
  document.getElementById('weather-icon').textContent = emoji
  document.getElementById('temperature').textContent = formatTemperature(current.temperature_2m)
  document.getElementById('weather-description').textContent = description
  document.getElementById('feels-like').textContent = formatTemperature(current.apparent_temperature)
  document.getElementById('humidity').textContent = formatHumidity(current.relative_humidity_2m)
  document.getElementById('wind-speed').textContent = formatWindSpeed(current.wind_speed_10m)
  currentWeather.classList.remove('hidden')
}

function renderForecast(daily) {
  const today = new Date().toISOString().slice(0, 10)
  const t = translations[currentLang]
  const cards = daily.time.map((date, i) => {
    const { emoji } = getWeatherInfo(daily.weather_code[i], currentLang)
    const label = date === today ? t.today : formatDay(date, currentLang)
    return `
      <div class="forecast-card">
        <div class="forecast-day">${label}</div>
        <div class="forecast-icon">${emoji}</div>
        <div class="forecast-temps">
          <span class="temp-high">${formatTemperature(daily.temperature_2m_max[i])}</span>
          <span class="temp-low">${formatTemperature(daily.temperature_2m_min[i])}</span>
        </div>
      </div>
    `
  })
  forecastGrid.innerHTML = cards.join('')
  forecastSection.classList.remove('hidden')
}

// ── Search ────────────────────────────────────────────────────────────────────

async function handleSearch(cityName) {
  const trimmed = cityName.trim()
  if (!trimmed) {
    showError({ message: 'EMPTY_INPUT' })
    return
  }
  showLoading()
  try {
    const location = await weatherApi.geocodeCity(trimmed)
    const weather = await weatherApi.getWeather(location.latitude, location.longitude)
    storage.saveLocation(location.name, location.latitude, location.longitude, location.country)
    lastRenderData = { current: weather.current, daily: weather.daily, locationName: location.name, country: location.country }
    renderCurrentConditions(weather.current, location.name, location.country)
    renderForecast(weather.daily)
  } catch (err) {
    showError(err)
  } finally {
    hideLoading()
  }
}

// ── Event listeners ───────────────────────────────────────────────────────────

searchBtn.addEventListener('click', () => handleSearch(searchInput.value))
searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleSearch(searchInput.value)
})

document.querySelectorAll('.lang-btn').forEach((btn) => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang))
})

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', async () => {
  currentLang = storage.getLang()
  applyTranslations(currentLang)

  const saved = storage.getLocation()
  if (!saved) return
  searchInput.value = saved.name
  showLoading()
  try {
    const weather = await weatherApi.getWeather(saved.latitude, saved.longitude)
    lastRenderData = { current: weather.current, daily: weather.daily, locationName: saved.name, country: saved.country }
    renderCurrentConditions(weather.current, saved.name, saved.country)
    renderForecast(weather.daily)
  } catch (err) {
    showError(err)
  } finally {
    hideLoading()
  }
})
