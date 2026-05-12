const GEOCODING_BASE = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_BASE = 'https://api.open-meteo.com/v1/forecast'

export async function geocodeCity(cityName) {
  const url = `${GEOCODING_BASE}?name=${encodeURIComponent(cityName)}&count=1`
  let data
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('FETCH_FAILED')
    data = await response.json()
  } catch (err) {
    if (err.message === 'FETCH_FAILED') throw err
    throw new Error('FETCH_FAILED')
  }
  if (!data.results?.length) throw new Error('LOCATION_NOT_FOUND')
  const { name, latitude, longitude, country_code } = data.results[0]
  return { name, latitude, longitude, country: country_code }
}

export async function getWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code',
    timezone: 'auto',
    forecast_days: '7',
  })
  const url = `${FORECAST_BASE}?${params}`
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('FETCH_FAILED')
    return await response.json()
  } catch (err) {
    if (err.message === 'FETCH_FAILED') throw err
    throw new Error('FETCH_FAILED')
  }
}
