/**
 * Redux slice to manage the current building
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Building } from "../types";
import { RootState } from "./store";

interface CurrentBuildingState {
  value: Building | null;
}

const initialState: CurrentBuildingState = {
  value: null
}

const currentBuildingSlice = createSlice({
  name: "currentBuilding",
  initialState,
  reducers: {
    setCurrentBuilding: (state, action: PayloadAction<Building | null>) => {
      state.value = action.payload;
    }
  }
});

export const { setCurrentBuilding } = currentBuildingSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCurrentBuilding = (state: RootState) => state.currentBuilding.value;

export default currentBuildingSlice.reducer;
