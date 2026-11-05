"use client";

import TimeBar from "@frontend/components/booking/TimeBar";
import FeedbackButton from "@frontend/components/feedback/FeedbackButton";
import FilterBar from "@frontend/components/filters/FilterBar";
import SortBar from "@frontend/components/filters/SortBar";
import BuildingDrawer from "@frontend/components/map/BuildingDrawer";
import RoomCardList from "@frontend/components/rooms/RoomCardList";
import SearchBar from "@frontend/components/search/SearchBar";
import TopBarGroup from "@frontend/components/ui/TopBarGroup";
import useQuerySort from "@frontend/hooks/query/useQuerySort";
import useFavouriteRooms from "@frontend/hooks/rooms/useDisplayedFavouriteRooms";
import { roomSortBarDropdown } from "@frontend/utils/constants";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enAU } from "date-fns/locale";
import { parseAsString, useQueryState } from "nuqs";
import React, { Suspense } from "react";

const Favourites = () => {
  const [sort, setSort] = useQuerySort(roomSortBarDropdown);
  const [query, setQuery] = React.useState<string>("");
  const [date] = useQueryState("date", parseAsString.withDefault(""));
  const favouriteRooms = useFavouriteRooms(query, sort);

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
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              justifyContent: { xs: "center", sm: "space-between" },
              alignItems: "center",
              marginTop: (theme) => `${theme.space.sm}px`,
              marginBottom: (theme) => `${theme.space.sm}px`,
              flexWrap: { sm: "wrap", md: "nowrap" },
              width: "100%",
            }}
          >
            <SearchBar
              setQuery={setQuery}
              placeholder="Search for favourite rooms"
            />

            <TopBarGroup>
              <FilterBar />
              <SortBar
                setSort={setSort}
                sort={sort}
                options={roomSortBarDropdown}
                title="Room Sort"
              />
              <TimeBar />
            </TopBarGroup>
          </Stack>
          <AlignedWithSearchBar>
            <RoomCardList rooms={favouriteRooms} date={date} />
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
