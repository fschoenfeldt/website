import axios, { AxiosResponse } from "axios";
import { formatDateTime, offsetDate } from "./utils";
import {
  City,
  LocationParams,
  WeatherParams,
  WeatherResult,
} from "./weatherTypes";

export const getDefaultWeatherParams = (): WeatherParams => {
  return {
    date: new Date().toISOString(),
    last_date: offsetDate(new Date(), 24).toISOString(),
    // current timezone inferred from the browser
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
};

/**
 * Get the weather for a location
 * @param city the city to get the weather for
 * @returns The weather result
 */
export const getWeatherFor = async (
  city: City,
): Promise<Array<WeatherResult>> => {
  if (!city.weather?.params) {
    throw new Error("No weather params found");
  }
  if (!city.weather?.params.tz) {
    console.warn(
      "No timezone found in weather params, using UTC which is probably wrong",
    );
  }
  const getWeatherParams = {
    ...city.weather.params,
    lat: city.lat,
    lon: city.lon,
  };

  console.debug({ getWeatherParams });
  const result = (
    await getWeather({
      ...getWeatherParams,
      date: formatDateTime(new Date(getWeatherParams.date)),
      last_date: formatDateTime(new Date(getWeatherParams.last_date)),
    })
  ).data;

  console.debug({ result });

  return result.weather.map((item: WeatherResult) => {
    return {
      ...item,
      temperature: Math.round(item.temperature),
    };
  });
};

const getWeather = async (params: {
  lat: number | string;
  lon: number | string;
  date: string;
  last_date: string;
  tz: string;
}) => {
  return await axios.get(`https://api.brightsky.dev/weather`, {
    params,
  });
};

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
