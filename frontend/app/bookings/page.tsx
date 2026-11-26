"use client";

import TimeBar from "@frontend/components/booking/TimeBar";
import FeedbackButton from "@frontend/components/feedback/FeedbackButton";
import FilterBar from "@frontend/components/filters/FilterBar";
import SortBar from "@frontend/components/filters/SortBar";
import SearchBar from "@frontend/components/search/SearchBar";
import TopBarGroup from "@frontend/components/ui/TopBarGroup";
import { API_URL } from "@frontend/config";
import useQuerySort from "@frontend/hooks/query/useQuerySort";
import {
  bookingsFilterDropdown,
  bookingsSortBarDropdown,
  NO_START_TIME,
} from "@frontend/utils/constants";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import axios from "axios";
import parseDates from "common/parseDates";
import type { BookingsPaginationResponse } from "common/types";
import { enAU } from "date-fns/locale/en-AU";
import { parseAsString, useQueryState } from "nuqs";
import React, { Suspense, useEffect, useRef } from "react";
import useSWRInfinite from "swr/infinite";

const PAGE_SIZE = 25;

// Fetch one page of bookings
const fetcher = async (url: string): Promise<BookingsPaginationResponse> => {
  const response = await axios.get<BookingsPaginationResponse>(url);
  return parseDates(response.data);
};

// Generating the url for the pages
const getKey = (
  pageIndex: number,
  previousPage: BookingsPaginationResponse | null
): string | null => {
  if (previousPage && (!previousPage.hasMore || !previousPage.nextCursor)) {
    return null;
  }

  const params = new URLSearchParams({
    limit: String(PAGE_SIZE),
    sort: "ascendingStart",
  });

  if (pageIndex > 0) {
    if (!previousPage?.nextCursor) {
      return null;
    }

    params.set("cursor", previousPage.nextCursor);
  }

  return `${API_URL}/bookings?${params.toString()}`;
};

const Bookings = () => {
  const [sort, setSort] = useQuerySort(bookingsSortBarDropdown);
  const [query, setQuery] = React.useState<string>("");
  const [start, setStart] = useQueryState(
    "start",
    parseAsString.withDefault("")
  );
  const startIsSet = start !== NO_START_TIME;
  const { data, error, isLoading, isValidating, size, setSize } =
    useSWRInfinite<BookingsPaginationResponse>(getKey, fetcher);

  const bookings = data?.flatMap((page) => page.bookings) ?? [];
  const hasMore = data?.[data.length - 1]?.hasMore ?? false;
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element || !hasMore || isValidating || isLoading) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void setSize((currSize) => currSize + 1);
        }
      },
      {
        rootMargin: "4000px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [hasMore, isValidating, isLoading, setSize, size]);

  return (
    <Container maxWidth={false}>
      <FeedbackButton />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enAU}>
        <Tiles>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              justifyContent: {
                xs: "center",
                sm: "space-between",
              },
              alignItems: "center",
              marginTop: (theme) => theme.space.sm,
              marginBottom: (theme) => theme.space.sm,
              flexWrap: { sm: "wrap", md: "nowrap" },
              width: "100%",
            }}
          >
            <SearchBar setQuery={setQuery} placeholder="Search for bookings" />

            <TopBarGroup>
              <FilterBar options={bookingsFilterDropdown} />
              <SortBar
                setSort={setSort}
                sort={sort}
                options={bookingsSortBarDropdown}
                title="Booking Sort"
              />
              <TimeBar
                startIsSet={startIsSet}
                onStartIsSetChange={(isSet) =>
                  setStart(isSet ? null : NO_START_TIME)
                }
              />
            </TopBarGroup>
          </Stack>
        </Tiles>
      </LocalizationProvider>
    </Container>
    // <main style={{ padding: space.lg }}>
    //   <h1>Bookings</h1>

    //   {isLoading && <p>Loading bookings...</p>}
    //   {error && <p>Failed to load bookings</p>}

    //   {bookings.map((booking) => (
    //     <article
    //       key={`${booking.roomId}-${booking.occurrenceId}`}
    //       style={{ marginBottom: space.lg }}
    //     >
    //       <h2>
    //         <Link
    //           href={`/booking/${encodeURIComponent(booking.roomId)}/${encodeURIComponent(booking.occurrenceId)}`}
    //         >
    //           {booking.name}
    //         </Link>
    //       </h2>

    //       <p>Room: {booking.roomId}</p>
    //       <p>Occurrence: {booking.occurrenceId}</p>
    //       <p>Event: {booking.eventId}</p>
    //       <p>Type: {booking.bookingType}</p>
    //       <p>
    //         Start:{" "}
    //         {booking.start.toLocaleString("en-AU", {
    //           timeZone: "Australia/Sydney",
    //         })}
    //       </p>
    //       <p>
    //         End:{" "}
    //         {booking.end.toLocaleString("en-AU", {
    //           timeZone: "Australia/Sydney",
    //         })}
    //       </p>
    //       <p>Planned size: {booking.plannedSize ?? "Unknown"}</p>

    //       <p>
    //         Modules:{" "}
    //         {booking.bookingModules.length > 0
    //           ? booking.bookingModules
    //               .map((module) => `${module.code} (${module.name})`)
    //               .join(", ")
    //           : "None"}
    //       </p>

    //       <hr />
    //     </article>
    //   ))}

    //   {hasMore && <div ref={loadMoreRef} />}

    //   {isValidating && <p>Loading more bookings...</p>}
    // </main>
  );
};

const Page = () => {
  return (
    <Suspense fallback={null}>
      <Bookings />
    </Suspense>
  );
};

const Tiles = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  alignItems: "center",
  padding: theme.spacing(0, 0, 1, 0),
}));

export default Page;
