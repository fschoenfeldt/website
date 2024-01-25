import { createSlice } from "@reduxjs/toolkit";
import { City } from "../../weather/weatherClient";

const intialCities: City[] = [
  {
    place_id: 378873920,
    licence:
      "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
    osm_type: "node",
    osm_id: 20833623,
    lat: "53.550341",
    lon: "10.000654",
    category: "place",
    type: "city",
    place_rank: 16,
    importance: 0.7255256463088224,
    addresstype: "city",
    name: "Hamburg",
    display_name: "Hamburg, 20095, Deutschland",
    boundingbox: ["53.3903410", "53.7103410", "9.8406540", "10.1606540"],
  },
  {
    place_id: 132404235,
    licence:
      "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
    osm_type: "relation",
    osm_id: 27020,
    lat: "54.7833021",
    lon: "9.4333264",
    category: "boundary",
    type: "administrative",
    place_rank: 12,
    importance: 0.5650494725085677,
    addresstype: "city",
    name: "Flensburg",
    display_name: "Flensburg, Schleswig-Holstein, Deutschland",
    boundingbox: ["54.7517986", "54.8370717", "9.3572980", "9.5068117"],
  },
  {
    place_id: 131709251,
    licence:
      "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
    osm_type: "relation",
    osm_id: 27021,
    lat: "54.3227085",
    lon: "10.135555",
    category: "boundary",
    type: "administrative",
    place_rank: 12,
    importance: 0.6369974907970997,
    addresstype: "city",
    name: "Kiel",
    display_name: "Kiel, Schleswig-Holstein, Deutschland",
    boundingbox: ["54.2507055", "54.4329395", "10.0329284", "10.2186177"],
  },
];

export const citiesSlice = createSlice({
  name: "cities",
  initialState: {
    value: intialCities,
  },
  reducers: {
    setCities: (_state, action) => {
      //   state.value = action.payload;

      return {
        value: action.payload,
      };
    },
    addCity: (state, action) => {
      /* console.debug({ action });
      state.value.push(action.payload);
      console.debug({ state }); */

      const newValue = [...state.value, action.payload];
      console.debug({ newValue });

      return {
        value: newValue,
      };
    },
    updateWeather: (state, action) => {
      const city = state.value.find(
        (city) => city.name === action.payload.name,
      );

      if (city) {
        city.weather = action.payload.weather;
      }
    },
    removeCity: (state, action) => {
      throw new Error("Not implemented");
      state.value = state.value.filter((city) => city !== action.payload);
    },
  },
});

export const { setCities, addCity, removeCity } = citiesSlice.actions;

export default citiesSlice.reducer;
