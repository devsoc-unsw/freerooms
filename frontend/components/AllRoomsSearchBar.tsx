import { useTheme } from "@mui/material";
import Stack from "@mui/material/Stack";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enAU } from "date-fns/locale";

import { selectDatetime, setDatetime } from "../redux/datetimeSlice";
import { useDispatch, useSelector } from "../redux/hooks";
import toSydneyTime from "../utils/toSydneyTime";

export default function AllRoomsSearchBar() {
  const dispatch = useDispatch();
  const datetime = useSelector(selectDatetime);
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      sx={{
        gap: 2,
        justifyContent: "space-between",
        left: "0px",
        paddingTop: "10px",
        position: "sticky",
        top: "0px",
        zIndex: 1,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enAU}>
        <DatePicker
          label="Date"
          value={datetime}
          sx={{ flex: 1 }}
          onChange={(value: Date | null) =>
            value && dispatch(setDatetime(toSydneyTime(value)))
          }
        />
        { /* Issue here */ }
        <TimePicker
          label="Start Time"
          defaultValue={datetime}
          sx={{ flex: 1 }}
          onAccept={(value: Date | null) =>
            value && dispatch(setDatetime(toSydneyTime(value)))
          }
        />
      </LocalizationProvider>
    </Stack>
  );
}
