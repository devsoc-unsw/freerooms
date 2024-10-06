/**
 * Redux slice to manage the selected filters
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AllRoomsFilter } from "../types";
import { RootState } from "./store";

interface RoomsFilterState {
  value: AllRoomsFilter;
}

const initialState: RoomsFilterState = {
  value: {
    usage: [],
    location: [],
    id: [],
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
      action: PayloadAction<{ key: keyof AllRoomsFilter; value: string }>
    ) => {
      const { key, value } = action.payload;
      state.value[key]!.push(value);
    },
    unsetAllRoomsFilter: (
      state,
      action: PayloadAction<{ key: keyof AllRoomsFilter; value: string }>
    ) => {
      const { key, value } = action.payload;
      if (Object.keys(state.value).includes(key)) {
        const targetIndex = state.value[key]!.indexOf(value);
        if (targetIndex > -1) {
          state.value[key]!.splice(targetIndex);
        }


      } else {
        throw "unsetting unincluded key"
      }
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
