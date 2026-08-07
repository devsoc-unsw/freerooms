import { parseAsString, useQueryStates } from "nuqs";
import { useEffect, useRef } from "react";
import { selectDatetime, setDatetime } from "redux/datetimeSlice";

import { useDispatch, useSelector } from "../redux/hooks";

const isValidDate = (date: string): boolean => {
  // Valid format is YYYY-MM-DD
  const newDate = new Date(date);
  return !isNaN(newDate.getTime());
};

const isValidTime = (time: string): boolean => {
  // Valid format is HH:MM (24-hour)
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
};

const useQueryDatetime = () => {
  const dispatch = useDispatch();
  const datetime = useSelector(selectDatetime);
  const isFirstRender = useRef(true);

  const [datetimeParams, setDatetimeParams] = useQueryStates(
    {
      date: parseAsString.withDefault(""),
      time: parseAsString.withDefault(""),
    },
    { shallow: true }
  );

  // Apply filters from URL query parameters to Redux datetime on load
  useEffect(() => {
    const { date, time } = datetimeParams;
    const invalidKeys: { date?: null; time?: null } = {};
    let hasInvalidParam = false;

    // Check if date and time params are valid, set to null if invalid
    if (date && !isValidDate(date)) {
      invalidKeys.date = null;
      hasInvalidParam = true;
    }

    if (time && !isValidTime(time)) {
      invalidKeys.time = null;
      hasInvalidParam = true;
    }

    if (hasInvalidParam) {
      setDatetimeParams(invalidKeys);
    }

    // Construct new Date object in UTC format from query parameters to Redux state
    if ((date && isValidDate(date)) || (time && isValidTime(time))) {
      const updateDate = new Date(datetime);

      // Get the actual date in UTC format
      if (date && isValidDate(date)) {
        const currentDate = new Date(date);
        updateDate.setFullYear(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        );
      }

      // Get the actual time in UTC format
      if (time && isValidTime(time)) {
        const [hours, minutes] = time.split(":").map(Number);
        updateDate.setHours(hours, minutes, 0, 0);
      }

      // Update Redux datetime
      dispatch(setDatetime(updateDate));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Apply filters from Redux datetime to URL query parameters when datetime changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Set date to YYYY-MM-DD format
    const date =
      datetime instanceof Date ? datetime.toISOString().split("T")[0] : null;

    // Set time to HH:MM format
    const time =
      datetime instanceof Date
        ? `${String(datetime.getHours()).padStart(2, "0")}:${String(datetime.getMinutes()).padStart(2, "0")}`
        : null;

    setDatetimeParams({ date, time });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datetime]);
};

export default useQueryDatetime;
