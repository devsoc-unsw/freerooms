/**
 * Redux slice to manage the selected datetime
 */
import { RootState } from "@frontend/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DatetimeSlice {
  value: Date;
}

const initialState: DatetimeSlice = {
  value: new Date(),
};

const datetimeSlice = createSlice({
  name: "datetime",
  initialState,
  reducers: {
    setDatetime: (state, action: PayloadAction<Date>) => {
      state.value = action.payload;
    },
  },
});

export const { setDatetime } = datetimeSlice.actions;

export const selectDatetime = (state: RootState) => state.datetime.value;

export default datetimeSlice.reducer;
