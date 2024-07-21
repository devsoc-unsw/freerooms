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
  value: {},
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
      if (!Object.keys(state.value).includes(key)) {
        state.value[key] = [];
      }
      state.value[key]?.push(value);
    },
    unsetAllRoomsFilter: (
      state,
      action: PayloadAction<{ key: keyof AllRoomsFilter; value: string }>
    ) => {
      const { key, value } = action.payload;
      if (Object.keys(state.value).includes(key)) {
        console.log(key, value);
        const { ...otherFilters } = state.value;
        const targetIndex = otherFilters["usage"]?.indexOf(value);
        if (targetIndex && targetIndex > -1)
          otherFilters["usage"]?.splice(targetIndex, 1);
        state.value = otherFilters;
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
