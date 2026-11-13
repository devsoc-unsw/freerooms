import allRoomsFilterSlice from "@frontend/redux/slices/allRoomsFilterSlice";
import currentBuildingReducer from "@frontend/redux/slices/currentBuildingSlice";
import datetimeReducer from "@frontend/redux/slices/datetimeSlice";
import filtersReducer from "@frontend/redux/slices/filtersSlice";
import searchOpenSlice from "@frontend/redux/slices/searchOpenSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";

// Create the root reducer separately, so we can extract the RootState type
const rootReducer = combineReducers({
  currentBuilding: currentBuildingReducer,
  datetime: datetimeReducer,
  filters: filtersReducer,
  searchOpen: searchOpenSlice,
  allRoomsFilters: allRoomsFilterSlice,
});

export const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Allow Date object in store
          ignoredActions: ["datetime/setDatetime"],
          ignoredPaths: ["datetime"],
        },
      }),
    preloadedState,
  });
};

const store = setupStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore["dispatch"];

export default store;
