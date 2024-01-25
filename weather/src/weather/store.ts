import { configureStore } from "@reduxjs/toolkit";
import citiesReducer from "../features/weather/citiesSlice";

export default configureStore({
  reducer: {
    cities: citiesReducer,
  },
});
