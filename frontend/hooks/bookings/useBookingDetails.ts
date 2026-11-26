import { API_URL } from "@frontend/config";
import axios from "axios";
import parseDates from "common/parseDates";
import { BookingDetails, bookingDetailsSchema } from "common/types";
import useSWR from "swr";


const fetcher = async (url: string): Promise<BookingDetails> => {
    const response = await axios.get(url);
    return bookingDetailsSchema.parse(parseDates(response.data));
}

const useBookingDetails = (
    roomId?: string,
    occurrenceId?: string
) => {
    const { data, error, isLoading, mutate} = useSWR<BookingDetails>(
        roomId && occurrenceId
            ? `${API_URL}/bookings/${encodeURIComponent(roomId)}/${encodeURIComponent(occurrenceId)}`
            : null,
        fetcher,
        {
            shouldRetryOnError: (error) =>
                !axios.isAxiosError(error) ||
                error.response?.status !== 404,
            errorRetryCount: 2,
        }
    );

    return {
        booking: data,
        error,
        isLoading,
        mutate,
        notFound:
            axios.isAxiosError(error) &&
            error.response?.status === 404
    };
};

export default useBookingDetails;