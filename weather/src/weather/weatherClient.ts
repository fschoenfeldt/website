import axios from 'axios'
import { formatDateTime, isoToDate, isoToTime, offsetDate } from './utils'

export interface WeatherParams {
  lat?: number
  lon?: number
  date: Date
  last_date?: Date
}

export interface WeatherResult {
  timestamp: string
  temperature: number
  wind_speed: number
  condition: string
  icon: string
}

/**
 * Get the weather for a location
 * @param {WeatherParams} params The parameters for the function
 * @returns {Promise<{}>} The weather result
 */
export const getWeatherFor = async (
  // therese params are set to satisfy the linter
  params: WeatherParams = {
    lat: 53.5488,
    lon: 9.9872,
    date: new Date(),
    last_date: offsetDate(new Date(), 24)
  }
): Promise<[WeatherResult]> => {
  const defaultParams = {
    // TODO: use nominatim to get the coordinates for the location
    lat: 53.5488,
    lon: 9.9872,
    date: new Date(),
    last_date: offsetDate(new Date(), 24)
  }

  params = { ...defaultParams, ...params }

  console.debug(params)

  params.date = formatDateTime(params.date)
  params.last_date = formatDateTime(params.last_date)

  console.debug(params)
  const result = (await getWeather(params)).data

  return result.weather.map((item: WeatherResult) => {
    return {
      ...item,
      temperature: Math.round(item.temperature),
      time: {
        date: isoToDate(item.timestamp),
        time: isoToTime(item.timestamp)
      }
    }
  })
}

const getWeather = async (params) => {
  return await axios.get(`https://api.brightsky.dev/weather`, {
    params
  })
}
