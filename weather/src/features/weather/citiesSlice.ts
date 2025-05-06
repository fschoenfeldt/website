import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getDefaultWeatherParams,
  getWeatherFor,
} from "../../weather/weatherClient";
import { City } from "../../weather/weatherTypes";

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

const initialState = {
  value: intialCities,
};

// TODO: consider using RTK-Query for this
// --> https://redux-toolkit.js.org/rtk-query/overview
export const fetchWeatherForCity = createAsyncThunk(
  "cities/fetchWeatherForCity",
  async (city: City) => {
    const weatherResult = await getWeatherFor(city);

    return {
      ...city,
      weather: {
        ...city.weather,
        isLoading: false,
        data: weatherResult,
        error: null,
      },
    };
  },
);

export const citiesSlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    setCities: (_state, action) => {
      return {
        value: action.payload,
      };
    },
    addCity: (state, action) => {
      let newCity = action.payload;
      if (!newCity.weather.params)
        console.warn("No weather params found, using current date/time/tz");

      newCity = {
        ...newCity,
        weather: {
          params: getDefaultWeatherParams(),
          ...newCity.weather,
          data: [],
          isLoading: false,
          error: undefined,
        },
      };

      return {
        value: [...state.value, newCity],
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
  extraReducers: (builder) => {
    builder.addCase(fetchWeatherForCity.pending, (state, action) => {
      const city = state.value.find(
        (city) => city.osm_id === action.meta.arg.osm_id,
      );

      if (city) {
        city.weather = {
          ...city.weather,
          params:
            action.meta.arg.weather?.params ||
            city.weather?.params ||
            getDefaultWeatherParams(),
          data: city.weather?.data || [],
          isLoading: true,
          error: undefined,
        };
      }
    });

    builder.addCase(fetchWeatherForCity.fulfilled, (state, action) => {
      const city = state.value.find(
        (city) => city.osm_id === action.meta.arg.osm_id,
      );

      if (city) {
        city.weather = {
          ...city.weather,
          data: action.payload.weather.data,
          isLoading: false,
          error: undefined,
        };
      }
    });

    builder.addCase(fetchWeatherForCity.rejected, (state, action) => {
      const city = state.value.find(
        (city) => city.osm_id === action.meta.arg.osm_id,
      );

      if (city) {
        city.weather = {
          ...city.weather,
          data: [],
          isLoading: false,
          error: action.error.message,
        };
      }
    });
  },
});

export const { setCities, addCity, removeCity } = citiesSlice.actions;

export default citiesSlice.reducer;
