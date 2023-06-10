/**
 * Redux slice to manage the selected datetime
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "./store";

interface DatetimeSlice {
  value: Date;
}

const initialState: DatetimeSlice = {
  value: new Date()
}

export const datetimeSlice = createSlice({
  name: "datetime",
  initialState,
  reducers: {
    setDatetime: (state, action: PayloadAction<Date>) => {
      state.value = action.payload;
    }
  }
});

export const { setDatetime } = datetimeSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectDatetime = (state: RootState) => state.datetime.value;

export default datetimeSlice.reducer;
