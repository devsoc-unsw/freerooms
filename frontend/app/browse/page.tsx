"use client";

import TimeBar from "@frontend/components/booking/TimeBar";
import FeedbackButton from "@frontend/components/feedback/FeedbackButton";
import FilterBar from "@frontend/components/filters/FilterBar";
import SortBar from "@frontend/components/filters/SortBar";
import BuildingDrawer from "@frontend/components/map/BuildingDrawer";
import RoomCardList from "@frontend/components/rooms/RoomCardList";
import BuildingRoomViewToggle from "@frontend/components/search/BuildingOrRoomViewToggle";
import SearchBar from "@frontend/components/search/SearchBar";
import TopBarGroup from "@frontend/components/ui/TopBarGroup";
import useQuerySort from "@frontend/hooks/query/useQuerySort";
import { BROWSE_VIEWS, NO_START_TIME, ROOM_LIST_PAGE_SIZE } from "@frontend/utils/constants";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enAU } from "date-fns/locale";
import { parseAsString, useQueryState } from "nuqs";
import { Suspense } from "react";
import CardList from "@frontend/components/rooms/CardList";
import useDisplayedRooms from "@frontend/hooks/rooms/useDisplayedRooms";
import useBrowseView from "@frontend/hooks/query/useBrowseView";
import TopBar from "@frontend/components/ui/TopBar";

const RoomsView = ({
  query,
  sort,
  startIsSet,
  date,
}: {
  query: string;
  sort: string;
  startIsSet: boolean;
  date: string;
}) => {
  const rooms = useDisplayedRooms({ query, sort, availableOnly: startIsSet });

  return (
    <RoomCardList
      rooms={rooms}
      date={date}
      pageSize={ROOM_LIST_PAGE_SIZE}
      emptyMessage={
        startIsSet
          ? "No rooms are free at the start time. Clear it to see every room."
          : "No rooms match your filters."
      }
    />
  );
};

const BrowseContent = () => {
  const [view, setView] = useBrowseView();
  const { sortOptions, sortTitle, filterKeys, searchPlaceholder } = BROWSE_VIEWS[view];
  const [sort, setSort] = useQuerySort(sortOptions);
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [start, setStart] = useQueryState("start", parseAsString.withDefault(""));
  const startIsSet = start !== NO_START_TIME;
  const [date] = useQueryState("date", parseAsString.withDefault(""));

  return (
    <Container maxWidth={false}>
      <FeedbackButton />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enAU}>
        <Tiles>
          <TopBar>
            <BuildingRoomViewToggle view={view} onChange={setView} />
            <SearchBar
              setQuery={setQuery}
              defaultValue={query}
              placeholder={searchPlaceholder}
            />

            <TopBarGroup>
              <FilterBar keys={filterKeys} />
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
          {view === "buildings" ? (
            <CardList sort={sort} query={query} />
          ) : (
            <RoomsView query={query} sort={sort} startIsSet={startIsSet} date={date} />
          )}
        </Tiles>
      </LocalizationProvider>
      {view === "buildings" && (
        <BuildingDrawer date={date} />
      )}
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
