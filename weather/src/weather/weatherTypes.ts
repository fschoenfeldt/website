export interface City {
  lat: number | string;
  lon: number | string;
  name: string;
  display_name: string;
  osm_id: number;
  weather?: {
    params?: WeatherParams;
    data: WeatherResult[];
    isLoading: boolean | undefined;
    error: string | undefined;
  };
  [key: string]: unknown;
}

/**
 * The weather parameters
 * @param date The date to get the weather for
 * @param last_date The last date to get the weather for
 * @param tz The timezone to get the weather for. If not provided, UTC is used
 */
export interface WeatherParams {
  date: string;
  last_date: string;
  tz: string;
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
  precipitation_probability: number | null;
  precipitation: number | null;
}

export interface LocationParams {
  city: string;
  country?: string;
}
