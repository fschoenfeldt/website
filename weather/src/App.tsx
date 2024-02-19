import {
  faArrowLeft,
  faCheck,
  faMagnifyingGlass,
  faPen,
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
import {
  getCurrentTimezone,
  isoToTime,
  toLocalISOString,
} from "./weather/utils";
import { City, WeatherResult } from "./weather/weatherTypes";
import { getCoordinatesFor } from "./weather/weatherClient";

function App() {
  const cities = useSelector((state: RootState) => state.cities.value);
  const dispatch: AppDispatch = useDispatch();

  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
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

  return (
    <>
      <MyNavbar
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedDate={selectedDate}
        onSelectDate={onSelectDate}
        isEditingDate={isEditingDate}
        setIsEditingDate={setIsEditingDate}
      />
      {selectedCity ? (
        <SelectedCity city={selectedCity} />
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

function MyNavbar({
  selectedCity,
  setSelectedCity,
  selectedDate,
  onSelectDate,
  isEditingDate,
  setIsEditingDate,
}: {
  selectedCity: City | null;
  setSelectedCity: (city: City | null) => void;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  isEditingDate: boolean;
  setIsEditingDate: (isEditingDate: boolean) => void;
}) {
  /*  const [isMenuOpen, setIsMenuOpen] = useState(false); */

  const [intermediateDate, setIntermediateDate] = useState<Date>(
    selectedDate || new Date(),
  );

  return (
    <Navbar maxWidth="full" className="bg-green-800 h-24 text-gray-100">
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
              startContent={
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  size="xs"
                  className="text-white"
                />
              }
            >
              <span className="sr-only text-white md:not-sr-only">
                Andere Stadt wählen
              </span>
            </Button>
          )}

          <div className="whitespace-break-spaces">
            Wettervorhersage
            {selectedCity && (
              <>
                {" "}
                für <span className="font-bold">{selectedCity.name}</span>
              </>
            )}
            {selectedDate && (
              <>
                {" "}
                am{" "}
                {isEditingDate ? (
                  <form action="#" className="inline-flex items-center gap-2">
                    <Input
                      className=""
                      type="datetime-local"
                      value={toLocalISOString(intermediateDate).slice(0, 16)}
                      min={toLocalISOString(new Date()).slice(0, 16)}
                      // maximum: 2 weeks in the future
                      max={toLocalISOString(
                        new Date(Date.now() + 12096e5),
                      ).slice(0, 16)}
                      onValueChange={(value) => {
                        setIntermediateDate(new Date(value));
                      }}
                    />
                    <Button
                      type="submit"
                      variant="bordered"
                      isIconOnly
                      onPress={() => {
                        if (intermediateDate) {
                          onSelectDate(intermediateDate);
                          setIsEditingDate(false);
                        }
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        size="xs"
                        className="text-white"
                      />
                    </Button>
                  </form>
                ) : (
                  <span className="space-x-2 font-bold">
                    <span>
                      {selectedDate.toLocaleDateString("de-DE", {
                        year: "numeric",
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <Button
                      variant="faded"
                      onPress={() => setIsEditingDate(true)}
                      aria-label="Datum bearbeiten"
                      size="sm"
                      isIconOnly
                    >
                      <FontAwesomeIcon icon={faPen} size="xs" />
                    </Button>
                  </span>
                )}
              </>
            )}
          </div>
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
                last_date: new Date(new Date().getTime() + 864e5).toISOString(),
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
  selectedDate,
  dispatch,
}: {
  isCityPickerOpen: boolean;
  onCityPickerOpenChange: (isOpen: boolean) => void;
  cities: City[];
  selectedDate: Date;
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
                selectedDate={selectedDate}
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
  selectedDate,
  dispatch,
  onCityPickerSubmit,
}: {
  cities: City[];
  selectedDate: Date;
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
        const newCity: City = {
          ...selectedCity,
          weather: {
            // TODO: DRY: this is multiple times in the code
            params: {
              date: selectedDate.toISOString(),
              last_date: new Date(selectedDate.getTime() + 864e5).toISOString(),
              tz: getCurrentTimezone(),
            },
            isLoading: undefined,
            error: undefined,
            data: [],
          },
        };
        dispatch(addCity(newCity));
        // @ts-expect-error // TODO: why does this typing not work :-( ?
        dispatch(fetchWeatherForCity(newCity));
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

function SelectedCity({ city }: { city: City }) {
  return (
    <>
      <WeatherTable city={city} />
    </>
  );
}

interface Column {
  key:
    | "timestamp"
    | "temperature"
    | "wind_speed"
    | "condition"
    | "icon"
    | "precipitation"
    | "precipitation_probability";
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
    {
      key: "precipitation",
      label: "Niederschlag",
    },
    {
      key: "precipitation_probability",
      label: "Niederschlagswahrscheinlichkeit",
    },
  ];

  return (
    <Table aria-label="Wetterbericht" shadow="none" isStriped>
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

                // API can return 0 as a valid value
                if (value === null || value === undefined) {
                  return (
                    <TableCell align="left" key={j} className="italic">
                      N/A
                    </TableCell>
                  );
                }

                let formattedValue = value;

                if (column.key === "timestamp") {
                  formattedValue = isoToTime(value as string);
                  // check if current date is today
                  const isValueToday =
                    new Date(value as string).toDateString() ===
                    new Date().toDateString();

                  if (isValueToday) {
                    formattedValue = `Heute, ${formattedValue}`;
                  } else {
                    const weekday = new Date(
                      value as string,
                    ).toLocaleDateString("de-DE", { weekday: "long" });
                    formattedValue = `${weekday}, ${formattedValue}`;
                  }
                }
                if (column.key === "temperature") {
                  formattedValue = `${value}°C`;
                }
                if (column.key === "wind_speed") {
                  formattedValue = `${value} km/h`;
                }
                if (column.key === "precipitation") {
                  formattedValue = `${value} mm`;
                }
                if (column.key === "precipitation_probability") {
                  formattedValue = `${value}%`;
                }
                if (column.key === "icon") {
                  return (
                    <TableCell align="left" key={j}>
                      <WeatherIcon weatherResult={row} />
                    </TableCell>
                  );
                } else {
                  return (
                    <TableCell align="left" key={j} className="py-4">
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
