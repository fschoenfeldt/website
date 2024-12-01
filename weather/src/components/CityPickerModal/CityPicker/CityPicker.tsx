import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input, Radio, RadioGroup } from "@nextui-org/react";
import { useCallback, useState } from "react";
import { useAsyncList } from "react-stately";
import {
  addCity,
  fetchWeatherForCity,
} from "../../../features/weather/citiesSlice";
import { getCurrentTimezone } from "../../../weather/utils";
import { City } from "../../../weather/weatherTypes";
import { getCoordinatesFor } from "../../../weather/weatherClient";

export function CityPicker({
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
              last_date: new Date(
                selectedDate.getTime() + 86400000,
              ).toISOString(),
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
  }, [
    cityResult,
    selection,
    dispatch,
    setInput,
    onCityPickerSubmit,
    selectedDate,
  ]);

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
