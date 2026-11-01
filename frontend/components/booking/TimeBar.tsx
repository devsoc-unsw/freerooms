import DateTimeSelector from "@frontend/components/booking/DateTimeSelector";
import TopBarMenu from "@frontend/components/ui/TopBarMenu";
import { selectDatetime, setDatetime } from "@frontend/redux/datetimeSlice";
import {
  selectFilters,
  setFilter,
  unsetFilter,
} from "@frontend/redux/filtersSlice";
import { useDispatch, useSelector } from "@frontend/redux/hooks";
import { SYDNEY_TIMEZONE } from "@frontend/utils/toSydneyTime";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import Stack from "@mui/material/Stack";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { addMinutes, differenceInMinutes } from "date-fns";
import { enAU } from "date-fns/locale";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import React from "react";

const TimeBar = () => {
  const dispatch = useDispatch();
  const datetime = useSelector(selectDatetime);
  const filters = useSelector(selectFilters);

  const startZoned = toZonedTime(datetime, SYDNEY_TIMEZONE);
  const handleStartChange = (value: Date) =>
    dispatch(setDatetime(fromZonedTime(value, SYDNEY_TIMEZONE)));

  const endZoned = addMinutes(startZoned, Number(filters.duration) || 0);
  const handleEndChange = (value: Date) => {
    const minutes = differenceInMinutes(value, startZoned);
    if (minutes > 0) {
      dispatch(setFilter({ key: "duration", value: String(minutes) }));
    } else {
      dispatch(unsetFilter("duration"));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enAU}>
      <TopBarMenu
        id="time-menu"
        icon={AccessTimeOutlinedIcon}
        label="Time"
        title="Input availability (from → to)"
        placement="bottom-end"
        wide
      >
        <Stack sx={{ gap: (theme) => `${theme.space.md}px` }}>
          <DateTimeSelector
            label="Start time"
            value={startZoned}
            onChange={handleStartChange}
          />
          <DateTimeSelector
            label="End time"
            value={endZoned}
            onChange={handleEndChange}
          />
        </Stack>
      </TopBarMenu>
    </LocalizationProvider>
  );
};

export default TimeBar;
