import axios, { AxiosResponse } from "axios";
import { formatDateTime, offsetDate } from "./utils";

export interface WeatherParams {
  city: City;
  date?: Date;
  last_date?: Date;
}

// icons based on https://brightsky.dev/docs/#/operations/getCurrentWeather
type WeatherIcon =
  | "clear-day"
  | "clear-night"
  | "partly-cloudy-day"
  | "partly-cloudy-night"
  | "cloudy"
  | "fog"
  | "wind"
  | "rain"
  | "sleet"
  | "snow"
  | "hail"
  | "thunderstorm"
  | null;

export interface WeatherResult {
  timestamp: string;
  temperature: number;
  wind_speed: number;
  condition: string;
  icon: WeatherIcon;
}

/**
 * Get the weather for a location
 * @param {WeatherParams} params The parameters for the function
 * @returns {Promise<{}>} The weather result
 */
export const getWeatherFor = async (
  // therese params are set to satisfy the linter
  params: WeatherParams,
): Promise<Array<WeatherResult>> => {
  const defaultParams = {
    date: new Date(),
    last_date: offsetDate(new Date(), 24),
  };

  const getWeatherParams = {
    ...defaultParams,
    ...params,
    lat: params.city.lat,
    lon: params.city.lon,
  };

  console.debug({ getWeatherParams });
  const result = (
    await getWeather({
      ...getWeatherParams,
      date: formatDateTime(getWeatherParams.date),
      last_date: formatDateTime(getWeatherParams.last_date),
    })
  ).data;

  console.debug({ result });

  return result.weather.map((item: WeatherResult) => {
    return {
      timestamp: item.timestamp,
      wind_speed: item.wind_speed,
      condition: item.condition,
      temperature: Math.round(item.temperature),
      icon: item.icon,
    };
  });
};

const getWeather = async (params: {
  lat: number | string;
  lon: number | string;
  date: string;
  last_date: string;
}) => {
  return await axios.get(`https://api.brightsky.dev/weather`, {
    params,
  });
};

export interface LocationParams {
  city: string;
  country?: string;
}

export interface City {
  lat: number | string;
  lon: number | string;
  name: string;
  display_name: string;
  osm_id: number;
  weather?: {
    params?: WeatherParams;
    data: WeatherResult[];
    isLoading: boolean;
    error: string | undefined;
  };
  [key: string]: unknown;
}

export const getCoordinatesFor = async (
  params: LocationParams,
): Promise<AxiosResponse<City[]>> => {
  const result = await getCoordinates({
    city: params.city,
    country: "germany",
  });

  return result;
};

const getCoordinates = async (params: LocationParams) => {
  return await axios.get(`https://nominatim.openstreetmap.org/search`, {
    params: {
      ...params,
      format: "jsonv2",
    },
  });
};
