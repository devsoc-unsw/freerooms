import { isValidDate } from "@frontend/utils/queryValidation";
import { format } from "date-fns";
import { parseAsString, useQueryStates } from "nuqs";
import { useEffect } from "react";
import { View, Views } from "react-big-calendar";

const validViewQueries: View[] = [Views.WEEK, Views.DAY];

const isValidView = (view: string): view is View =>
  validViewQueries.includes(view as View);

const useBookingCalenderQuery = (
  defaultDate: Date
): [View, Date, (view: View) => void, (date: Date) => void] => {
  const [calendarParams, setCalendarParams] = useQueryStates(
    {
      view: parseAsString.withDefault(Views.WEEK),
      date: parseAsString.withDefault(""),
    },
    { shallow: true }
  );

  useEffect(() => {
    const invalidKeys: { view?: null; date?: null } = {};
    let hasInvalidParam = false;

    if (calendarParams.view && !isValidView(calendarParams.view)) {
      invalidKeys.view = null;
      hasInvalidParam = true;
    }

    if (calendarParams.date && !isValidDate(calendarParams.date)) {
      invalidKeys.date = null;
      hasInvalidParam = true;
    }

    if (hasInvalidParam) {
      setCalendarParams(invalidKeys);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const view = isValidView(calendarParams.view)
    ? calendarParams.view
    : Views.WEEK;

  const date =
    calendarParams.date && isValidDate(calendarParams.date)
      ? new Date(`${calendarParams.date}T00:00:00`)
      : defaultDate;

  const setView = (nextView: View) => {
    setCalendarParams({ view: nextView });
  };

  const setDate = (nextDate: Date) => {
    setCalendarParams({ date: format(nextDate, "yyy-MM-dd") });
  };

  return [view, date, setView, setDate];
};

export default useBookingCalenderQuery;
