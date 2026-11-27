import { API_URL } from "@frontend/config";
import axios from "axios";
import parseDates from "common/parseDates";
import {
  BookingsEventResponse,
  bookingsEventResponseSchema,
} from "common/types";
import useSWR from "swr";

const fetcher = async (url: string): Promise<BookingsEventResponse[]> => {
  const response = await axios.get(url);
  return bookingsEventResponseSchema.array().parse(parseDates(response.data));
};

const useRelatedBookings = (eventId?: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<BookingsEventResponse[]>(
    eventId ? `${API_URL}/bookings/event/${encodeURIComponent(eventId)}` : null,
    fetcher,
    {
      errorRetryCount: 2,
    },
  );

  return {
    relatedBookings: data,
    error,
    isLoading,
    mutate,
  };
};

export default useRelatedBookings;
