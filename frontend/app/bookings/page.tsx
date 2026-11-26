"use client";

import BookingsCardList from "@frontend/components/booking/BookingsCardList";
import TimeBar from "@frontend/components/booking/TimeBar";
import FeedbackButton from "@frontend/components/feedback/FeedbackButton";
import FilterBar from "@frontend/components/filters/FilterBar";
import SortBar from "@frontend/components/filters/SortBar";
import SearchBar from "@frontend/components/search/SearchBar";
import TopBarGroup from "@frontend/components/ui/TopBarGroup";
import { API_URL } from "@frontend/config";
import { useSelector } from "@frontend/redux/hooks";
import { selectDatetime } from "@frontend/redux/slices/datetimeSlice";
import { selectFilters } from "@frontend/redux/slices/filtersSlice";
import type { BookingsFilters, Filters } from "@frontend/types";
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
import { addMinutes } from "date-fns";
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

const Bookings = () => {
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsString.withDefault("ascendingStart")
  );
  const [query, setQuery] = React.useState<string>("");
  const [start, setStart] = useQueryState(
    "start",
    parseAsString.withDefault("")
  );
  const getFilters = useSelector(selectFilters);
  const filters = getFilters as Filters & BookingsFilters;
  const datetime = useSelector(selectDatetime);
  const startIsSet = start !== NO_START_TIME;

  useEffect(() => {
    if (!bookingsSortBarDropdown.some((option) => option.value === sort)) {
      void setSort(null);
    }
  }, [sort, setSort]);

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
      sort,
    });

    // Add search query to params
    const search = query.trim();
    if (search) params.set("search", search);

    // Add filter query to params
    if (filters.bookingType) params.set("bookingType", filters.bookingType);
    if (filters.plannedSize !== undefined) {
      params.set("plannedSize", filters.plannedSize);
    }
    if (filters.location) params.set("location", filters.location);

    if (startIsSet) {
      params.set("startTime", datetime.toISOString());

      const durationMinutes = Number(filters.duration);
      if (Number.isFinite(durationMinutes) && durationMinutes > 0) {
        params.set(
          "endTime",
          addMinutes(datetime, durationMinutes).toISOString()
        );
      }
    }

    if (pageIndex > 0) {
      if (!previousPage?.nextCursor) {
        return null;
      }

      params.set("cursor", previousPage.nextCursor);
    }

    return `${API_URL}/bookings?${params.toString()}`;
  };

  const { data, error, isLoading, isValidating, size, setSize } =
    useSWRInfinite<BookingsPaginationResponse>(getKey, fetcher, {
      persistSize: false,
    });

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
                resetSort="ascendingStart"
              />
              <TimeBar
                startIsSet={startIsSet}
                onStartIsSetChange={(isSet) =>
                  setStart(isSet ? null : NO_START_TIME)
                }
              />
            </TopBarGroup>
          </Stack>
          <AlignedWithSearchBar>
            {error && <p>Failed to load bookings</p>}

            <BookingsCardList
              bookings={isLoading ? undefined : bookings}
              emptyMessage="No bookings found"
            />

            {hasMore && <div ref={loadMoreRef} />}

            {isValidating && <p>Loading more bookings...</p>}
          </AlignedWithSearchBar>
        </Tiles>
      </LocalizationProvider>
    </Container>
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

const AlignedWithSearchBar = styled("div")(({ theme }) => ({
  width: "100%",
  boxSizing: "border-box",
  [theme.breakpoints.up("sm")]: { paddingLeft: theme.space.md },
}));

export default Page;
