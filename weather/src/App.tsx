import {
  faArrowLeft,
  faMagnifyingGlass,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Navbar,
  NavbarBrand,
  NavbarContent,
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
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TableBody, useAsyncList } from "react-stately";
import "./App.css";
import { WeatherIcon } from "./components/icons/WeatherIcon";
import { addCity, fetchWeatherForCity } from "./features/weather/citiesSlice";
import { AppDispatch, RootState } from "./weather/store";
import { isoToTime } from "./weather/utils";
import {
  City,
  WeatherResult,
  getCoordinatesFor,
} from "./weather/weatherClient";

function App() {
  /*   const weatherList = useAsyncList({
    async load() {
      const weatherResult = await getWeatherFor();
      // console.debug(weatherResult);
      return { items: weatherResult };
    },
  }); */

  // const [cities, setCities] = useState<City[]>(intialCities);
  const cities = useSelector((state: RootState) => state.cities.value);
  const dispatch: AppDispatch = useDispatch();

  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const {
    isOpen: isCityPickerOpen,
    onOpen: onCityPickerOpen,
    onOpenChange: onCityPickerOpenChange,
  } = useDisclosure();

  // TODO: somehow, only the last city doesnt have a forecas

  return (
    <>
      <MyNavbar selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
      {selectedCity ? (
        <SelectedCity city={selectedCity} setSelectedCity={setSelectedCity} />
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
            dispatch={dispatch}
          />
        </>
      )}
    </>
  );
}

function MyNavbar({
  selectedCity,
  setSelectedCity,
}: {
  selectedCity: City | null;
  setSelectedCity: (city: City | null) => void;
}) {
  /*  const [isMenuOpen, setIsMenuOpen] = useState(false); */

  return (
    <Navbar>
      <NavbarContent>
        {/* <NavbarMenuToggle
          aria-label={isMenuOpen ? "Menü öffnen" : "Menü schließen"}
          className="sm:hidden"
        /> */}
        <NavbarBrand className="flex gap-4 sm:gap-6">
          {selectedCity && (
            <Button
              variant="bordered"
              onPress={() => setSelectedCity(null)}
              startContent={<FontAwesomeIcon icon={faArrowLeft} size="xs" />}
            >
              <p className="">Andere Stadt wählen</p>
            </Button>
          )}

          <p>
            Wettervorhersage
            {selectedCity && (
              <>
                {" "}
                für <span className="font-bold">{selectedCity.name}</span>
              </>
            )}
          </p>
        </NavbarBrand>
      </NavbarContent>
    </Navbar>
  );
}

function CityList({
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
      console.debug("pressed city btn");
      console.debug({ city });
      setSelectedCity(city);
    },
    [setSelectedCity],
  );

  // fetch initial weather data
  useEffect(() => {
    cities.forEach((city) => {
      if (city.weather == null) {
        dispatch(fetchWeatherForCity(city));
      }
    });
  });

  if (cities.length == 0) {
    return <p>Keine Städte vorhanden. Füge eine hinzu!</p>;
  }

  return (
    <ul className="grid grid-cols-2 place-items-center gap-2 sm:grid-cols-4 sm:gap-4">
      {cities.map((city) => (
        <li key={city.osm_id}>
          <Button
            className="h-24 w-24 sm:h-32 sm:w-32"
            variant="flat"
            onClick={() => onPressCityButton(city)}
          >
            <div className="flex w-full flex-col items-center">
              <div className="w-full">
                <p className="overflow-hidden overflow-ellipsis">{city.name}</p>
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
        <li>
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
  );
}

function SingleForecast({ city }: { city: City }) {
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

function CityPickerModal({
  isCityPickerOpen,
  onCityPickerOpenChange,
  cities,
  dispatch,
}: {
  isCityPickerOpen: boolean;
  onCityPickerOpenChange: (isOpen: boolean) => void;
  cities: City[];
  dispatch: AppDispatch;
}) {
  return (
    <Modal isOpen={isCityPickerOpen} onOpenChange={onCityPickerOpenChange}>
      <ModalContent>
        {(closeModal) => (
          <>
            <ModalHeader>Neue Stadt hinzufügen</ModalHeader>
            <ModalBody>
              <CityPicker
                cities={cities}
                dispatch={dispatch}
                onCityPickerSubmit={() => {
                  closeModal();
                }}
              />
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
  onCityPickerSubmit,
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
    if (selection) {
      onCityPickerSubmit && onCityPickerSubmit();
      const selectedCity = cityResult.items[parseInt(selection)];

      // fade out animation lasts 200ms
      // timeout is needed to wait for animation to finish
      setTimeout(() => {
        dispatch(addCity(selectedCity));
        // @ts-expect-error // TODO: why does this typing not work :-( ?
        dispatch(fetchWeatherForCity(selectedCity));
        setInput("");
        setSelection("");
        cityResult.reload();
      }, 200);
    }
  }, [cityResult, selection, dispatch, setInput, onCityPickerSubmit]);

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
          placeholder="Hamburg"
          value={input}
          onValueChange={setInput}
          autoFocus
          isRequired
        />
        <Input label="Land" value="Deutschland" isDisabled />
        <Button
          type="submit"
          variant="flat"
          startContent={<FontAwesomeIcon icon={faMagnifyingGlass} size="xs" />}
        >
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
        <Button type="submit" onClick={onPressAddCityButton} color="primary">
          Hinzufügen
        </Button>
      )}
    </>
  );
}

function SelectedCity({
  city,
  setSelectedCity,
}: {
  city: City;
  setSelectedCity: (city: City | null) => void;
}) {
  return (
    <>
      <Button onPress={() => setSelectedCity(null)} color="secondary">
        Zurück
      </Button>
      <WeatherTable city={city} />
    </>
  );
}

interface Column {
  key: "timestamp" | "temperature" | "wind_speed" | "condition" | "icon";
  label: string;
  allowsSorting?: boolean;
}

function WeatherTable({ city }: { city: City }) {
  const { weather } = city;
  const isLoading = weather?.isLoading;

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

  if (weather?.data == null) {
    return <p className="p-4">Keine Daten vorhanden.</p>;
  }

  const tableColumns: Column[] = [
    {
      key: "icon",
      label: "Symbol",
    },
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
        {weather.data.map((row, i) => {
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
                  formattedValue = isoToTime(value as string);
                }
                if (column.key === "temperature") {
                  formattedValue = `${value}°C`;
                }
                if (column.key === "wind_speed") {
                  formattedValue = `${value} km/h`;
                }
                if (column.key === "icon") {
                  return (
                    <TableCell align="left" key={j}>
                      <WeatherIcon weatherResult={row} />
                    </TableCell>
                  );
                } else {
                  return (
                    <TableCell align="left" key={j}>
                      {formattedValue}
                    </TableCell>
                  );
                }
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default App;
