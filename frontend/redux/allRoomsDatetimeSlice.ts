/**
 * Redux slice to manage the selected datetime for all rooms page
 */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "./store";

interface AllRoomsDatetimeSlice {
  start: Date;
  end: Date | null;
}

const initialState: AllRoomsDatetimeSlice = {
  start: new Date(),
  end: null,
};

const allRoomsDatetimeSlice = createSlice({
  name: "allRoomsDatetime",
  initialState,
  reducers: {
    setDatetime: (state, action: PayloadAction<{ start: Date; end: Date }>) => {
      state.start = action.payload.start;
      state.end = action.payload.end;
    },
  },
});

export const { setDatetime } = allRoomsDatetimeSlice.actions;

export const selectAllRoomsDatetime = (state: RootState) =>
  state.allRoomsDatetime;

export default allRoomsDatetimeSlice.reducer;
