import Stack from "@mui/material/Stack";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import { selectDatetime, setDatetime } from "../../redux/datetimeSlice";
import { useDispatch, useSelector } from "../../redux/hooks";
import toSydneyTime from "../../utils/toSydneyTime";

export default function AllRoomsSearchBar() {
  const dispatch = useDispatch();
  const datetime = useSelector(selectDatetime);

  return (
    <Stack
      direction="row"
      gap={2}
      justifyContent="space-between"
      left="0px"
      paddingTop="10px"
      position="sticky"
      top="0px"
      zIndex={1}
      sx={{ backgroundColor: "#fff" }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Date"
          value={dayjs(datetime)}
          sx={{ width: "50%" }}
          onChange={(value) =>
            value && dispatch(setDatetime(toSydneyTime(value.toDate())))
          }
        />
        <TimePicker
          label="Start Time"
          value={dayjs(datetime)}
          sx={{ width: "50%" }}
          onAccept={(value) =>
            value && dispatch(setDatetime(toSydneyTime(value.toDate())))
          }
        />
      </LocalizationProvider>
    </Stack>
  );
}
