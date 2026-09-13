"use client";

import DatePicker from "@frontend/components/booking/DatePicker";
import TimePicker from "@frontend/components/booking/TimePicker";
import FeedbackButton from "@frontend/components/feedback/FeedbackButton";
import FilterBar from "@frontend/components/filters/FilterBar";
import SortBar from "@frontend/components/filters/SortBar";
import SearchBar from "@frontend/components/search/SearchBar";
import useQuerySort from "@frontend/hooks/useQuerySort";
import BuildingDrawer from "@frontend/views/BuildingDrawer";
import CardList from "@frontend/views/CardList";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enAU } from "date-fns/locale";
import { parseAsString, useQueryState } from "nuqs";
import React, { Suspense } from "react";

const BrowseContent = () => {
  const [sort, setSort] = useQuerySort();
  const [query, setQuery] = React.useState<string>("");
  const [date] = useQueryState("date", parseAsString.withDefault(""));

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
              marginTop: 1,
              marginBottom: 1,
              flexWrap: { sm: "wrap", md: "nowrap" },
              width: "100%",
            }}
          >
            <Stack
              direction="row"
              spacing={2}
              sx={{
                justifyContent: "space-between",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <FilterBar />
              <SortBar setSort={setSort} sort={sort} />
            </Stack>

            <SearchBar setQuery={setQuery} />

            <Stack
              direction="row"
              spacing={2}
              sx={{
                alignItems: "center",
                alignSelf: "center",
                justifyContent: "space-between",
                marginTop: { xs: 1, sm: 0 },
              }}
            >
              <DatePicker />
              <TimePicker />
            </Stack>
          </Stack>
          <CardList sort={sort} query={query} />
        </Tiles>
      </LocalizationProvider>
      <BuildingDrawer date={date} />
    </Container>
  );
};

const Page = () => {
  return (
    <Suspense fallback={null}>
      <BrowseContent />
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
