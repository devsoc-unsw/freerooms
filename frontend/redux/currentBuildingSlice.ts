/**
 * Redux slice to manage the current building
 */
import { Building } from "@common/types";
import { RootState } from "@frontend/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentBuildingState {
  value: Building | null;
}

const initialState: CurrentBuildingState = {
  value: null,
};

const currentBuildingSlice = createSlice({
  name: "currentBuilding",
  initialState,
  reducers: {
    setCurrentBuilding: (state, action: PayloadAction<Building | null>) => {
      state.value = action.payload;
    },
  },
});

export const { setCurrentBuilding } = currentBuildingSlice.actions;

export const selectCurrentBuilding = (state: RootState) =>
  state.currentBuilding.value;

export default currentBuildingSlice.reducer;
