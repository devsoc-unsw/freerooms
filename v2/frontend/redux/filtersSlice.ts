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

interface SetFilterPayload {
  key: keyof Filters;
  value: string;
}

export const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<SetFilterPayload>) => {
      const { key, value } = action.payload;
      state.value[key] = value;
    },
    unsetFilter: (state, action: PayloadAction<keyof Filters>) => {
      if (Object.keys(state).includes(action.payload)) {
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
