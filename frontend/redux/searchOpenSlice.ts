/**
 * Redux slice to manage whether the search modal is open
 */
import { createSlice } from "@reduxjs/toolkit";

import { RootState } from "./store";

interface SearchOpenState {
  value: boolean;
}

const initialState: SearchOpenState = {
  value: false,
};

const searchOpenSlice = createSlice({
  name: "searchOpen",
  initialState,
  reducers: {
    openSearch: (state) => {
      state.value = true;
    },
    closeSearch: (state) => {
      state.value = false;
    },
    toggleSearch: (state) => {
      state.value = !state.value;
    },
  },
});

export const { openSearch, closeSearch, toggleSearch } =
  searchOpenSlice.actions;

export const selectSearchOpen = (state: RootState) => state.searchOpen.value;

export default searchOpenSlice.reducer;
