import { Skeleton } from "@nextui-org/react";
import { WeatherIcon } from "../../WeatherIcon/WeatherIcon";
import { City, WeatherResult } from "../../../weather/weatherTypes";

export function SingleForecast({ city }: { city: City }) {
  // TODO: i dont like how this looks
  const { weather } = city;

  if (weather?.isLoading || weather == undefined) {
    return <Skeleton className="inline-block h-4 w-8" />;
  }

  if (weather?.error) {
    return <p className="text-red-500">{weather?.error}</p>;
  }

  const currentWeather = weather.data.find((weatherResult: WeatherResult) => {
    const date = new Date(weatherResult.timestamp);
    const now = new Date();

    // find nearest time with unix timestamp
    return date.getTime() > now.getTime();
  });

  return (
    <>
      <div className="m-2 flex flex-col items-center justify-center gap-1">
        <WeatherIcon weatherResult={currentWeather} />
        <div>{currentWeather?.temperature}°C</div>
      </div>
    </>
  );
}
