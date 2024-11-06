/**
 * Redux slice to manage the selected filters
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AllRoomsFilters } from "../types";
import { RootState } from "./store";

interface RoomsFilterState {
  value: AllRoomsFilters;
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
      action: PayloadAction<{ key: keyof AllRoomsFilters; value: string }>
    ) => {
      const { key, value } = action.payload;
      state.value[key]!.push(value);
    },
    unsetAllRoomsFilter: (
      state,
      action: PayloadAction<{ key: keyof AllRoomsFilters; value: string }>
    ) => {
      const { key, value } = action.payload;
      if (Object.keys(state.value).includes(key)) {
        // find the index of the unset value and remove this element from the list.
        const targetIndex = state.value[key]!.indexOf(value);
        if (targetIndex > -1) {
          state.value[key]!.splice(targetIndex);
        }
      } else {
        throw "unsetting value that was already unset";
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
