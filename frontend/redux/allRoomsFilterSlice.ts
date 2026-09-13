/**
 * Redux slice to manage the selected filters
 */
import { RootState } from "@frontend/redux/store";
import { AllRoomsFilters } from "@frontend/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RoomsFilterState {
  value: AllRoomsFilters;
}

const initialState: RoomsFilterState = {
  value: {
    capacity: "",
    usage: "",
    location: "",
    duration: "",
    recurring: "",
    id: "",
  },
  // Needs to be initalised to silence errors
  // TODO: Get values from constants.ts
};

const filtersSlice = createSlice({
  name: "allRoomsFilters",
  initialState,
  reducers: {
    setAllRoomsFilter: (
      state,
      action: PayloadAction<{ key: keyof AllRoomsFilters; value: string }>
    ) => {
      const { key, value } = action.payload;
      state.value[key] = value;
    },
    unsetAllRoomsFilter: (
      state,
      action: PayloadAction<{ key: keyof AllRoomsFilters; value: string }>
    ) => {
      const { key, value } = action.payload;
      state.value[key] = value;
    },
    clearAllRoomsFilters: (state) => {
      state.value = {};
    },
  },
});

export const { setAllRoomsFilter, unsetAllRoomsFilter, clearAllRoomsFilters } =
  filtersSlice.actions;

export const selectAllRoomsFilters = (state: RootState) =>
  state.allRoomsFilters.value;

export default filtersSlice.reducer;
