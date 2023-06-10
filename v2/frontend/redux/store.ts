import { configureStore } from '@reduxjs/toolkit'

import currentBuildingReducer from "./currentBuildingSlice";
import datetimeReducer from "./datetimeSlice";
import filtersReducer from "./filtersSlice";

const store = configureStore({
  reducer: {
    currentBuilding: currentBuildingReducer,
    datetime: datetimeReducer,
    filters: filtersReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Allow Date object in store
        ignoredActions: ['datetime/setDatetime'],
        ignoredPaths: ['datetime'],
      },
    }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
