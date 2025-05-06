import { Button, useDisclosure } from "@nextui-org/react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { fetchWeatherForCity } from "./features/weather/citiesSlice";
import { AppDispatch, RootState } from "./weather/store";
import { getCurrentTimezone } from "./weather/utils";
import { City } from "./weather/weatherTypes";
import { CityList } from "./components/CityList/CityList";
import { CityPickerModal } from "./components/CityPickerModal/CityPickerModal";
import { WeatherTable } from "./components/WeatherTable/WeatherTable";
import { WeatherNavbar } from "./components/WeatherNavbar/WeatherNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function App() {
  const cities = useSelector((state: RootState) => state.cities.value);
  const dispatch: AppDispatch = useDispatch();

  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const onSelectDate = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      cities.forEach((city) => {
        dispatch(
          fetchWeatherForCity({
            ...city,
            weather: {
              data: [],
              // TODO: this is kinda ugly
              isLoading: undefined,
              error: undefined,
              ...city.weather,
              params: {
                date: date.toISOString(),
                last_date: new Date(date.getTime() + 864e5).toISOString(),
                tz: getCurrentTimezone(),
              },
            },
          }),
        );
      });
    },
    [setSelectedDate, dispatch, cities],
  );

  // update selected city if not found exactly in cities
  // this is needed when the city's weather data is updated
  useEffect(() => {
    if (selectedCity) {
      const selectedCityFound = cities.find(
        (city) => city.osm_id === selectedCity.osm_id,
      );

      if (selectedCityFound !== undefined) {
        setSelectedCity(selectedCityFound);
      }
    }
  }, [cities, selectedCity]);

  const [isEditingDate, setIsEditingDate] = useState(false);

  const {
    isOpen: isCityPickerOpen,
    onOpen: onCityPickerOpen,
    onOpenChange: onCityPickerOpenChange,
  } = useDisclosure();

  const onPressIncreaseLastDate = useCallback(
    (city: City) => {
      const referenceCity = city || cities[0];

      if (!referenceCity || !referenceCity.weather?.params?.last_date)
        throw new Error(
          "no valid reference city found for increasing last date!",
        );

      const oldLastDate = new Date(referenceCity.weather.params.last_date);

      // increase by 12 hours
      const newLastDate = new Date(oldLastDate.getTime() + 432e5);

      // update last date for all cities
      cities.forEach((city) => {
        dispatch(
          fetchWeatherForCity({
            ...city,
            weather: {
              ...city.weather!,
              params: {
                ...city.weather!.params!,
                last_date: newLastDate.toISOString(),
              },
            },
          }),
        );
      });
    },
    [dispatch, cities],
  );

  return (
    <>
      <WeatherNavbar
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        isEditingDate={isEditingDate}
        setIsEditingDate={setIsEditingDate}
      />
      {selectedCity ? (
        <CityDetailView
          city={selectedCity}
          onPressIncreaseLastDate={onPressIncreaseLastDate}
        />
      ) : (
        <>
          <CityList
            cities={cities}
            showAddButton
            onPressAddButton={onCityPickerOpen}
            setSelectedCity={setSelectedCity}
            dispatch={dispatch}
          />
          <CityPickerModal
            isCityPickerOpen={isCityPickerOpen}
            onCityPickerOpenChange={onCityPickerOpenChange}
            cities={cities}
            selectedDate={selectedDate}
            dispatch={dispatch}
          />
        </>
      )}
    </>
  );
}

function CityDetailView({
  city,
  onPressIncreaseLastDate,
}: {
  city: City;
  onPressIncreaseLastDate: (city: City) => void;
}) {
  const onPressIncrease = useCallback(() => {
    onPressIncreaseLastDate(city);
  }, [onPressIncreaseLastDate, city]);

  return (
    <div>
      <WeatherTable city={city} />
      <div className="mb-4 flex justify-center">
        {/* TODO: after pressing, scroll down to last entry */}
        <Button
          type="button"
          size="lg"
          variant="solid"
          className="w-full sm:w-auto"
          startContent={<FontAwesomeIcon icon={faPlus} />}
          onPress={() => onPressIncrease()}
        >
          Mehr anzeigen
        </Button>
      </div>
    </div>
  );
}

export default App;
