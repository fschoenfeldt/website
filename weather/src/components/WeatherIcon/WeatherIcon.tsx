import {
  faSun,
  faMoon,
  faCloud,
  faCloudSun,
  faCloudMoon,
  faWind,
  faCloudRain,
  faSnowflake,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { WeatherResult } from "../../weather/weatherTypes";

export function WeatherIcon({
  weatherResult,
}: {
  weatherResult: WeatherResult | undefined;
}) {
  let iconToUse = faSun;

  const { icon } = weatherResult || {};

  if (icon === "clear-day") {
    iconToUse = faSun;
  }
  if (icon === "clear-night") {
    iconToUse = faMoon;
  }
  if (icon === "partly-cloudy-day") {
    iconToUse = faCloudSun;
  }
  if (icon === "partly-cloudy-night") {
    iconToUse = faCloudMoon;
  }
  if (icon === "cloudy") {
    iconToUse = faCloud;
  }
  if (icon === "fog") {
    // theres no fog icon, so just use cloud
    iconToUse = faCloud;
  }
  if (icon === "wind") {
    iconToUse = faWind;
  }
  if (icon === "rain") {
    iconToUse = faCloudRain;
  }
  if (icon === "sleet" || icon === "snow") {
    iconToUse = faSnowflake;
  }
  if (icon === "hail") {
    // theres no hail icon, so just use cloud
    iconToUse = faCloud;
  }
  if (icon === "thunderstorm") {
    iconToUse = faBolt;
  }

  return (
    <FontAwesomeIcon icon={iconToUse} size="xl" className="!text-gray-700" />
  );
}
