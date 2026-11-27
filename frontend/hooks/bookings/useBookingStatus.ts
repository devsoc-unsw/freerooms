import { getBookingStatus } from "@frontend/utils/bookingStatus";
import { Booking } from "common/types";
import { useEffect, useState } from "react";

const UPDATE_INTERVAL_MS = 60 * 1000;

const useBookingStatus = (booking?: Pick<Booking, "start" | "end">) => {
  const [now, setNow] = useState(() => new Date());

  // Start poll on initial load
  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(new Date());
    }, UPDATE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, []);

  return booking ? getBookingStatus(booking, now) : undefined;
};

export default useBookingStatus;
