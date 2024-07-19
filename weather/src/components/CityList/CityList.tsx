import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "@nextui-org/react";
import { useCallback, useEffect } from "react";
import { fetchWeatherForCity } from "../../features/weather/citiesSlice";
import { AppDispatch } from "../../weather/store";
import { getCurrentTimezone } from "../../weather/utils";
import { City } from "../../weather/weatherTypes";
import { SingleForecast } from "./SingleForecast/SingleForecast";

export function CityList({
  cities,
  showAddButton,
  onPressAddButton,
  setSelectedCity,
  dispatch,
}: {
  cities: City[];
  showAddButton: boolean;
  onPressAddButton: () => void;
  setSelectedCity: (city: City) => void;
  dispatch: AppDispatch;
}) {
  const onPressCityButton = useCallback(
    (city: City) => {
      setSelectedCity(city);
    },
    [setSelectedCity],
  );

  // fetch initial weather data
  useEffect(() => {
    cities.forEach((city) => {
      if (city.weather == null) {
        dispatch(
          fetchWeatherForCity({
            ...city,
            weather: {
              data: [],
              isLoading: undefined,
              error: undefined,
              params: {
                date: new Date().toISOString(),
                last_date: new Date(
                  new Date().getTime() + 86400000,
                ).toISOString(),
                tz: getCurrentTimezone(),
              },
            },
          }),
        );
      }
    });
  });

  if (cities.length == 0) {
    return <p>Keine Städte vorhanden. Füge eine hinzu!</p>;
  }

  return (
    <div className="sm:my-4 md:my-8">
      <ul className="grid place-items-center divide-y-2 sm:grid-cols-4 sm:gap-4 sm:divide-y-0">
        {cities.map((city) => (
          <li key={city.osm_id} className="w-full sm:w-auto">
            <Button
              className="h-24 w-full sm:h-32 sm:w-32"
              variant="flat"
              onPress={() => onPressCityButton(city)}
            >
              <div className="flex w-full items-center justify-between sm:flex-col">
                <div className="sm:w-full">
                  <p className="overflow-hidden overflow-ellipsis text-lg sm:text-base">
                    {city.name}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="sr-only">Temperatur in {city.name}:</span>
                  <SingleForecast city={city} />
                </div>
              </div>
            </Button>
          </li>
        ))}
        {showAddButton && (
          <li className="mt-4 !border-0 sm:mt-0">
            <Button
              className="h-24 w-24 sm:h-32 sm:w-32"
              variant="flat"
              color="secondary"
              onPress={onPressAddButton}
              radius="full"
              aria-label="Stadt zur Liste hinzufügen"
            >
              <FontAwesomeIcon icon={faPlus} size="xl" />
            </Button>
          </li>
        )}
      </ul>
    </div>
  );
}
