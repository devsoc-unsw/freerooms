"use client";

import axios from "axios";
import type { BookingsPaginationResponse } from "common/types";
import parseDates from "common/parseDates";
import { API_URL } from "@frontend/config";
import useSWRInfinite from "swr/infinite";
import Link from "next/link";

const PAGE_SIZE = 10;

// Fetch one page of bookings
const fetcher = async (
    url: string
): Promise<BookingsPaginationResponse> => {
    const response = await axios.get<BookingsPaginationResponse>(url);
    return parseDates(response.data);
}


// Generating the url for the pages
const getKey = (
    pageIndex: number,
    previousPage: BookingsPaginationResponse | null,
): string | null => {
    if (previousPage && (!previousPage.hasMore || !previousPage.nextCursor)) {
        return null;
    }

    const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        sort: "ascendingStart"
    });

    if (pageIndex > 0) {
        if (!previousPage?.nextCursor) {
            return null;
        }

        params.set("cursor", previousPage.nextCursor);
    }

    return `${API_URL}/bookings?${params.toString()}`;
}

export default function BookingsPage() {
    const {
        data,
        error,
        isLoading,
        isValidating,
        size,
        setSize,
    } = useSWRInfinite<BookingsPaginationResponse>(getKey, fetcher);

    const bookings = data?.flatMap((page) => page.bookings) ?? [];
    const hasMore = data?.[data.length - 1]?.hasMore ?? false;

    return (
        <main style={{padding: 24}}>
            <h1>Bookings</h1>

            {isLoading && <p>Loading bookings...</p>}
            {error && <p>Failed to load bookings</p>}

            {bookings.map((booking) => (
                <article
                    key={`${booking.roomId}-${booking.occurrenceId}`}
                    style={{ marginBottom: 24 }}
                >
                    <h2>
                        <Link href={`/booking/${encodeURIComponent(booking.roomId)}/${encodeURIComponent(booking.occurrenceId)}`}>
                            {booking.name}
                        </Link>
                    </h2>

                    <p>Room: {booking.roomId}</p>
                    <p>Occurrence: {booking.occurrenceId}</p>
                    <p>Event: {booking.eventId}</p>
                    <p>Type: {booking.bookingType}</p>
                    <p>
                        Start: {booking.start.toLocaleString("en-AU", {
                            timeZone: "Australia/Sydney"
                        })}
                    </p>
                    <p>
                        End: {booking.end.toLocaleString("en-AU", {
                            timeZone: "Australia/Sydney"
                        })}
                    </p>
                    <p>Planned size: {booking.plannedSize ?? "Unknown"}</p>

                    <p>
                        Modules:{" "}
                        {booking.bookingModules.length > 0
                            ? booking.bookingModules
                                .map((module) => `${module.code} (${module.name})`)
                                .join(", ")
                            : "None"
                        }
                    </p>
                </article>
            ))}

            {hasMore && (
                <button
                    type="button"
                    disabled={isValidating}
                    onClick={() => void setSize(size + 1)}
                >
                    {isValidating ? "Loading..." : "Load more"}
                </button>
            )}
        </main>
    )
}