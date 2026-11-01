"use client";

import TimeBar from "@frontend/components/booking/TimeBar";
import FeedbackButton from "@frontend/components/feedback/FeedbackButton";
import FilterBar from "@frontend/components/filters/FilterBar";
import SortBar from "@frontend/components/filters/SortBar";
import RoomCardList from "@frontend/components/rooms/RoomCardList";
import SearchBar from "@frontend/components/search/SearchBar";
import useFavouriteRooms from "@frontend/hooks/useFavouriteRooms";
import useQuerySort from "@frontend/hooks/useQuerySort";
import { roomSortBarDropdown } from "@frontend/utils/constants";
import BuildingDrawer from "@frontend/views/BuildingDrawer";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enAU } from "date-fns/locale";
import { parseAsString, useQueryState } from "nuqs";
import React, { Suspense } from "react";
import TopBarGroup from "@frontend/components/ui/TopBarGroup";

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
            <Typography variant="h3" sx={{ fontWeight: 800, color: "primary.main", mt: 3 }}>
              Favourite Rooms
            </Typography>
          </AlignedWithSearchBar>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              justifyContent: { xs: "center", sm: "space-between" },
              alignItems: "center",
              marginTop: 1,
              marginBottom: 1,
              flexWrap: { sm: "wrap", md: "nowrap" },
              width: "100%",
            }}
          >
            <SearchBar setQuery={setQuery} placeholder="Search for favourite rooms" />

            <TopBarGroup>
              <FilterBar />
              <SortBar setSort={setSort} sort={sort} options={roomSortBarDropdown} />
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
