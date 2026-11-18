"use client";
// Building or room view page
import TimeBar from "@frontend/components/booking/TimeBar";
import FeedbackButton from "@frontend/components/feedback/FeedbackButton";
import FilterBar from "@frontend/components/filters/FilterBar";
import SortBar from "@frontend/components/filters/SortBar";
import BuildingDrawer from "@frontend/components/map/BuildingDrawer";
import RoomCardList from "@frontend/components/rooms/RoomCardList";
import SearchBar from "@frontend/components/search/SearchBar";
import TopBarGroup from "@frontend/components/ui/TopBarGroup";
import useQuerySort from "@frontend/hooks/query/useQuerySort";
import useDisplayedFavouriteRooms from "@frontend/hooks/rooms/useDisplayedFavouriteRooms";
import { NO_START_TIME, roomSortBarDropdown } from "@frontend/utils/constants";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enAU } from "date-fns/locale";
import { parseAsString, useQueryState } from "nuqs";
import React, { Suspense } from "react";
import CardList from "@frontend/components/rooms/CardList";

const BrowseContent = () => {
  const [sort, setSort] = useQuerySort();
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [start, setStart] = useQueryState(
    "start",
    parseAsString.withDefault("")
  );
  const startIsSet = start !== NO_START_TIME;
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

            <SearchBar
              setQuery={setQuery}
              placeholder="Search for free rooms"
            />

            <TopBarGroup>
              <FilterBar />
              <SortBar
                setSort={setSort}
                sort={sort}
                options={roomSortBarDropdown}
                title="Room Sort"
              />
              <TimeBar
                startIsSet={startIsSet}
                onStartIsSetChange={(isSet) =>
                  setStart(isSet ? null : NO_START_TIME)
                }
              />
            </TopBarGroup>
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
