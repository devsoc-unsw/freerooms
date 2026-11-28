/**
 * Redux slice to manage the selected filters
 */
import { RootState } from "@frontend/redux/store";
import { AllFilters, FilterKey, FilterSelection } from "@frontend/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FiltersState {
  value: AllFilters;
}

const initialState: FiltersState = {
  value: {},
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<FilterSelection>) => {
      const { key, value } = action.payload;

      if (Array.isArray(value) && value.length === 0) {
        delete state.value[key];
        return;
      }

      state.value = {
        ...state.value,
        [key]: value,
      };
    },
    unsetFilter: (state, action: PayloadAction<FilterKey>) => {
      delete state.value[action.payload];
    },
    clearFilters: (state) => {
      state.value = {};
    },
  },
});

export const { setFilter, unsetFilter, clearFilters } = filtersSlice.actions;

export const selectFilters = (state: RootState) => state.filters.value;

export default filtersSlice.reducer;
