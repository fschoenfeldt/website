import { Basisdaten } from "./components/Basisdaten";
import { GenericTableBody, Kennzahlen } from "./components/Kennzahlen";
import "./App.css";
import {
  City,
  WeatherResult,
  getCoordinatesFor,
  getWeatherFor,
} from "./weather/weatherClient";
import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Skeleton,
  Table,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { AsyncListData, TableBody, useAsyncList } from "react-stately";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addCity } from "./features/weather/citiesSlice";
import { isoToTime } from "./weather/utils";

function App() {
  /*   const weatherList = useAsyncList({
    async load() {
      const weatherResult = await getWeatherFor();
      // console.debug(weatherResult);
      return { items: weatherResult };
    },
  }); */

  // const [cities, setCities] = useState<City[]>(intialCities);
  const cities = useSelector((state) => state.cities.value);
  const dispatch = useDispatch();

  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const {
    isOpen: isCityPickerOpen,
    onOpen: onCityPickerOpen,
    onOpenChange: onCityPickerOpenChange,
  } = useDisclosure();

  // TODO: somehow, only the last city doesnt have a forecas

  return (
    <>
      {selectedCity ? (
        <SelectedCity city={selectedCity} setSelectedCity={setSelectedCity} />
      ) : (
        <>
          <h1>Gespeicherte Städte:</h1>
          <CityList
            cities={cities}
            showAddButton
            onPressAddButton={onCityPickerOpen}
            setSelectedCity={setSelectedCity}
          />
          <CityPickerModal
            isCityPickerOpen={isCityPickerOpen}
            onCityPickerOpenChange={onCityPickerOpenChange}
            cities={cities}
            dispatch={dispatch}
          />
        </>
      )}

      {/* <WeatherTable
        weatherItems={weatherList.items}
        isLoading={weatherList.isLoading}
      />
       <Kennzahlen />
      <Basisdaten /> */}
    </>
  );
}

function CityList({
  cities,
  showAddButton,
  onPressAddButton,
  setSelectedCity,
}: {
  cities: City[];
  showAddButton: boolean;
  onPressAddButton: () => void;
  setSelectedCity: (city: City) => void;
}) {
  const onPressCityButton = useCallback(
    (city: City) => {
      console.debug("pressed");
      console.debug({ city });
      setSelectedCity(city);
    },
    [setSelectedCity],
  );

  if (cities.length == 0) {
    return <p>Keine Städte vorhanden. Füge eine hinzu!</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
      {cities.map((city) => (
        <li key={city.osm_id}>
          <Button
            className="h-32 w-32"
            variant="flat"
            onClick={() => onPressCityButton(city)}
          >
            <div className="flex flex-col items-center">
              <div>{city.name}</div>
              {/* <div className="flex items-center">
                <span className="sr-only">Temperatur in {city.name}:</span>
                <SingleForecast forecasts={forecasts} city={city} />
              </div> */}
            </div>
          </Button>
        </li>
      ))}
      {showAddButton && (
        <li>
          <Button
            className="h-32 w-32"
            variant="flat"
            color="secondary"
            onPress={onPressAddButton}
            radius="full"
          >
            +
          </Button>
        </li>
      )}
    </ul>
  );
}

function SingleForecast({
  forecasts,
  city,
}: {
  forecasts: AsyncListData<{ city: City; weather: WeatherResult[] }>;
  city: City;
}) {
  // TODO: i dont like how this looks
  const forecastsForCity = useMemo(() => {
    return forecasts.items.find((item) => item.city.osm_id === city.osm_id);
  }, [forecasts, city]);

  if (forecasts.items.length == 0 || forecasts.isLoading) {
    return <Skeleton className="inline-block h-4 w-8" />;
  }

  if (forecastsForCity == null) {
    return <p className="text-red-500">error</p>;
  }

  const currentForecast = forecastsForCity.weather.find(
    (weatherResult: WeatherResult) => {
      const date = new Date(weatherResult.timestamp);
      const now = new Date();

      // find nearest time with unix timestamp
      return date.getTime() > now.getTime();
    },
  );

  return (
    <>
      {forecastsForCity && currentForecast && (
        <div>{currentForecast.temperature}°C</div>
      )}
    </>
  );
}

function CityPickerModal({
  isCityPickerOpen,
  onCityPickerOpenChange,
  cities,
  dispatch,
}) {
  return (
    <Modal isOpen={isCityPickerOpen} onOpenChange={onCityPickerOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Neue Stadt hinzufügen</ModalHeader>
            <ModalBody>
              <CityPicker cities={cities} dispatch={dispatch} />
            </ModalBody>
            <ModalFooter>
              {/* <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button> */}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function CityPicker({
  cities,
  dispatch,
}: {
  cities: City[];
  dispatch: (arg0: { payload: City }) => void;
  onCityPickerSubmit?: () => void;
}) {
  const [input, setInput] = useState<string>("");
  const cityResult = useAsyncList({
    async load() {
      if (input == "") {
        return { items: [] };
      }

      const cityList = await getCoordinatesFor({
        city: input,
      });

      return { items: cityList.data };
    },
  });
  const [selection, setSelection] = useState<string>();

  const onPressAddCityButton = useCallback(() => {
    const selectedCity = cityResult.items[parseInt(selection)];

    dispatch(addCity(selectedCity));
    setInput("");
    setSelection("");
    cityResult.reload();
  }, [cityResult, selection, dispatch]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          cityResult.reload();
        }}
        action=""
        className="space-y-2"
      >
        <Input
          label="Stadt"
          placeholder="Stadt"
          value={input}
          onValueChange={setInput}
        />
        <Input label="Land" value="Deutschland" isDisabled />
        <Button type="submit" variant="flat">
          Suche
        </Button>
      </form>
      {cityResult.items.length > 0 && (
        <>
          <RadioGroup
            label="Wähle die passende Stadt aus"
            onValueChange={setSelection}
            isRequired
          >
            {cityResult.items.map((city, i) =>
              cities.find((c) => c.osm_id == city.osm_id) ? (
                <Radio key={i} value={i.toString()} isDisabled>
                  {city.display_name} (bereits hinzugefügt)
                </Radio>
              ) : (
                <Radio key={i} value={i.toString()}>
                  {city.display_name}
                </Radio>
              ),
            )}
          </RadioGroup>
        </>
      )}
      {selection !== null && selection !== undefined && (
        <Button onClick={onPressAddCityButton} color="primary">
          Hinzufügen
        </Button>
      )}
    </>
  );
}

function SelectedCity({ city, setSelectedCity }: { city: City }) {
  // TODO this feature could be implemented via routing instead
  // of using a state variable
  const forecast = useAsyncList({
    async load() {
      const weather = await getWeatherFor({
        city: city,
      });

      return { items: weather };
    },
  });

  return (
    <>
      <Button onPress={() => setSelectedCity(null)} color="secondary">
        Zurück
      </Button>
      <WeatherTable
        weatherItems={forecast.items}
        isLoading={forecast.isLoading}
      />
    </>
  );
}

interface Column {
  key: string;
  label: string;
  allowsSorting?: boolean;
}

function WeatherTable({
  weatherItems,
  isLoading,
}: {
  weatherItems: WeatherResult[] | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    const rows = 4;
    const cols = 4;

    return (
      <>
        <p className="sr-only p-4">Lade Daten...</p>

        <div aria-hidden="true" className="space-y-2 p-4">
          <Skeleton className="h-12 w-full" />
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              {Array.from({ length: cols }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-6 w-full" />
              ))}
            </div>
          ))}
        </div>
      </>
    );
  }

  if (weatherItems == null || weatherItems.length == 0) {
    return <p className="p-4">Keine Daten vorhanden.</p>;
  }

  const tableColumns: Column[] = [
    {
      key: "timestamp",
      label: "Zeitpunkt",
      allowsSorting: true,
    },
    {
      key: "temperature",
      label: "Temperatur",
      allowsSorting: true,
    },
    {
      key: "wind_speed",
      label: "Windgeschwindigkeit",
    },
    {
      key: "condition",
      label: "Wetterlage",
    },
    // {
    //   key: "icon",
    //   label: "Icon"
    // }
  ];

  return (
    <Table aria-label="Wetterbericht" shadow="none">
      <TableHeader>
        {tableColumns.map((column) => {
          return (
            <TableColumn
              align="start"
              key={column.key}
              allowsSorting={column.allowsSorting}
            >
              {column.label}
            </TableColumn>
          );
        })}
      </TableHeader>
      <TableBody>
        {weatherItems.map((row, i) => {
          return (
            <TableRow key={i}>
              {tableColumns.map((column, j) => {
                const value = row[column.key];

                if (!value) {
                  return (
                    <TableCell
                      align="left"
                      key={j}
                      className="bg-gray-100 italic dark:bg-gray-800"
                    >
                      N/A
                    </TableCell>
                  );
                }

                let formattedValue = value;

                if (column.key === "timestamp") {
                  formattedValue = isoToTime(value);
                }
                if (column.key === "temperature") {
                  formattedValue = `${value}°C`;
                }
                if (column.key === "wind_speed") {
                  formattedValue = `${value} km/h`;
                }

                return (
                  <TableCell align="left" key={j}>
                    {formattedValue}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default App;
