"use client";

import TimeBar from "@frontend/components/booking/TimeBar";
import FeedbackButton from "@frontend/components/feedback/FeedbackButton";
import FilterBar from "@frontend/components/filters/FilterBar";
import SortBar from "@frontend/components/filters/SortBar";
import BuildingDrawer from "@frontend/components/map/BuildingDrawer";
import RoomCardList from "@frontend/components/rooms/RoomCardList";
import SearchBar from "@frontend/components/search/SearchBar";
import TopBar from "@frontend/components/ui/TopBar";
import TopBarGroup from "@frontend/components/ui/TopBarGroup";
import useQuerySort from "@frontend/hooks/query/useQuerySort";
import useDisplayedRooms from "@frontend/hooks/rooms/useDisplayedRooms";
import { BROWSE_VIEWS, NO_START_TIME } from "@frontend/utils/constants";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enAU } from "date-fns/locale";
import { parseAsString, useQueryState } from "nuqs";
import React, { Suspense } from "react";

const Favourites = () => {
  const { sortOptions, sortTitle } = BROWSE_VIEWS.rooms;
  const [sort, setSort] = useQuerySort(sortOptions);
  const [query, setQuery] = React.useState<string>("");
  const [start, setStart] = useQueryState(
    // start time set by default. clearing start time shows all favourites, and updates in the URL
    "start",
    parseAsString.withDefault("")
  );
  const startIsSet = start !== NO_START_TIME;

  const [date] = useQueryState("date", parseAsString.withDefault(""));
  const favouriteRooms = useDisplayedRooms({query, sort, availableOnly: startIsSet, favouritesOnly: true});

  return (
    <Container maxWidth={false}>
      <FeedbackButton />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enAU}>
        <Tiles>
          <AlignedWithSearchBar>
            <Typography
              variant="h3"
              sx={(theme) => ({
                fontWeight: 800,
                color: "primary.main",
                marginTop: `${theme.space.lg}px`,
              })}
            >
              Favourite Rooms
            </Typography>
          </AlignedWithSearchBar>
          <TopBar>
            <SearchBar
              setQuery={setQuery}
              placeholder="Search for favourite rooms"
            />

            <TopBarGroup>
              <FilterBar />
              <SortBar
                setSort={setSort}
                sort={sort}
                options={sortOptions}
                title={sortTitle}
              />
              <TimeBar
                startIsSet={startIsSet}
                onStartIsSetChange={(isSet) =>
                  setStart(isSet ? null : NO_START_TIME)
                }
              />
            </TopBarGroup>
          </TopBar>
          <AlignedWithSearchBar>
            <RoomCardList
              rooms={favouriteRooms}
              date={date}
              emptyMessage={
                startIsSet
                  ? "No rooms to show. Rooms in use at the start time are hidden, so clear it to see all your favourites."
                  : undefined
              }
            />
          </AlignedWithSearchBar>
        </Tiles>
      </LocalizationProvider>
      <BuildingDrawer date={date} />
    </Container>
  );
};

const Page = () => {
  return (
    <Suspense fallback={null}>
      <Favourites />
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
