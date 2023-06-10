/**
 * Redux slice to manage the selected datetime
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Filters } from "../types";
import { RootState } from "./store";

interface FiltersState {
  value: Filters
}

const initialState: FiltersState = {
  value: {}
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ key: keyof Filters, value: string }>) => {
      const { key, value } = action.payload;
      state.value[key] = value;
    },
    unsetFilter: (state, action: PayloadAction<keyof Filters>) => {
      if (Object.keys(state).includes(action.payload)) {
        // otherFilters contains all keys besides action.payload
        const { [action.payload]: unset, ...otherFilters } = state.value;
        state.value = otherFilters;
      }
    },
    clearFilters: (state) => {
      state.value = {};
    }
  }
});

export const { setFilter, unsetFilter, clearFilters } = filtersSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectFilters = (state: RootState) => state.filters.value;

export default filtersSlice.reducer;
