const WMO_CODES = {
  0:  { emoji: '☀️',  en: 'Clear sky',                       zh: '晴空' },
  1:  { emoji: '🌤️', en: 'Mainly clear',                    zh: '大致晴朗' },
  2:  { emoji: '⛅',  en: 'Partly cloudy',                   zh: '局部多云' },
  3:  { emoji: '☁️',  en: 'Overcast',                        zh: '阴天' },
  45: { emoji: '🌫️', en: 'Fog',                              zh: '雾' },
  48: { emoji: '🌫️', en: 'Depositing rime fog',             zh: '冻雾' },
  51: { emoji: '🌦️', en: 'Light drizzle',                   zh: '小毛毛雨' },
  53: { emoji: '🌦️', en: 'Moderate drizzle',                zh: '中等毛毛雨' },
  55: { emoji: '🌧️', en: 'Dense drizzle',                   zh: '大毛毛雨' },
  56: { emoji: '🌨️', en: 'Light freezing drizzle',          zh: '轻冻毛毛雨' },
  57: { emoji: '🌨️', en: 'Heavy freezing drizzle',          zh: '强冻毛毛雨' },
  61: { emoji: '🌧️', en: 'Slight rain',                     zh: '小雨' },
  63: { emoji: '🌧️', en: 'Moderate rain',                   zh: '中雨' },
  65: { emoji: '🌧️', en: 'Heavy rain',                      zh: '大雨' },
  66: { emoji: '🌨️', en: 'Light freezing rain',             zh: '轻冻雨' },
  67: { emoji: '🌨️', en: 'Heavy freezing rain',             zh: '强冻雨' },
  71: { emoji: '🌨️', en: 'Slight snowfall',                 zh: '小雪' },
  73: { emoji: '❄️',  en: 'Moderate snowfall',               zh: '中雪' },
  75: { emoji: '❄️',  en: 'Heavy snowfall',                  zh: '大雪' },
  77: { emoji: '🌨️', en: 'Snow grains',                     zh: '米雪' },
  80: { emoji: '🌦️', en: 'Slight rain showers',             zh: '小阵雨' },
  81: { emoji: '🌧️', en: 'Moderate rain showers',           zh: '中等阵雨' },
  82: { emoji: '⛈️',  en: 'Violent rain showers',            zh: '强阵雨' },
  85: { emoji: '🌨️', en: 'Slight snow showers',             zh: '小阵雪' },
  86: { emoji: '❄️',  en: 'Heavy snow showers',              zh: '大阵雪' },
  95: { emoji: '⛈️',  en: 'Thunderstorm',                    zh: '雷暴' },
  96: { emoji: '⛈️',  en: 'Thunderstorm with slight hail',   zh: '轻冰雹雷暴' },
  99: { emoji: '⛈️',  en: 'Thunderstorm with heavy hail',    zh: '强冰雹雷暴' },
}

export function formatTemperature(celsius) {
  return `${Math.round(celsius)}°C`
}

export function formatWindSpeed(kmh) {
  return `${Math.round(kmh)} km/h`
}

export function formatHumidity(percent) {
  return `${percent}%`
}

export function formatDay(isoDateString, lang = 'en') {
  const date = new Date(isoDateString + 'T12:00:00')
  const locale = lang === 'zh' ? 'zh-CN' : 'en-US'
  return date.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' })
}

export function getWeatherInfo(code, lang = 'en') {
  const entry = WMO_CODES[code] ?? { emoji: '🌡️', en: 'Unknown conditions', zh: '未知天气' }
  return { emoji: entry.emoji, description: lang === 'zh' ? entry.zh : entry.en }
}
