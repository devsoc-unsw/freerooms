"use client";

import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enAU } from "date-fns/locale";
import React, { Suspense } from "react";
import BuildingDrawer from "views/BuildingDrawer";

import DatePicker from "../../components/DatePicker";
import FeedbackButton from "../../components/FeedbackButton";
import FilterBar from "../../components/FilterBar";
import SearchBar from "../../components/SearchBar";
import SortBar from "../../components/SortBar";
import TimePicker from "../../components/TimePicker";
import useQuerySort from "../../hooks/useQuerySort";
import CardList from "../../views/CardList";

const Page = () => {
  const [sort, setSort] = useQuerySort();
  const [query, setQuery] = React.useState<string>("");

  return (
    <Suspense fallback={null}>
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
        <BuildingDrawer />
      </Container>
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
