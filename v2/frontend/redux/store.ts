import { configureStore } from '@reduxjs/toolkit'

import currentBuildingReducer from "./currentBuildingSlice";

const store = configureStore({
  reducer: {
    currentBuilding: currentBuildingReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
