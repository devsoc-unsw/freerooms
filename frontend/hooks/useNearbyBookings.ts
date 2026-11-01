import useBookings from "@frontend/hooks/useBookings";
import { selectDatetime } from "@frontend/redux/datetimeSlice";
import { useSelector } from "@frontend/redux/hooks";
import { SYDNEY_TIMEZONE } from "@frontend/utils/toSydneyTime";
import { isSameDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const isSameSydneyDay = (a: Date, b: Date): boolean =>
  isSameDay(toZonedTime(a, SYDNEY_TIMEZONE), toZonedTime(b, SYDNEY_TIMEZONE));

// current is the booking using the room now, nextLaterThatDay is the first booking that starts after it (on the same day)
const useNearbyBookings = (roomId: string | undefined, enabled: boolean) => {
  const datetime = useSelector(selectDatetime);
  const { bookings } = useBookings(enabled ? roomId : undefined);

  const current = bookings?.find(
    (booking) => booking.start <= datetime && datetime < booking.end
  );

  const startingLater = (bookings ?? []).filter(
    (booking) => booking.start > datetime
  );
  const [next] = startingLater.sort(
    (a, b) => a.start.getTime() - b.start.getTime()
  );
  const nextLaterThatDay =
    next && isSameSydneyDay(next.start, datetime) ? next : undefined;

  return { current, nextLaterThatDay };
};

export default useNearbyBookings;
