"use client";

import TimeBar from "@frontend/components/booking/TimeBar";
import FeedbackButton from "@frontend/components/feedback/FeedbackButton";
import FilterBar from "@frontend/components/filters/FilterBar";
import SortBar from "@frontend/components/filters/SortBar";
import BuildingDrawer from "@frontend/components/map/BuildingDrawer";
import CardList from "@frontend/components/rooms/CardList";
import RoomCardList from "@frontend/components/rooms/RoomCardList";
import BuildingRoomViewToggle from "@frontend/components/search/BuildingOrRoomViewToggle";
import SearchBar from "@frontend/components/search/SearchBar";
import PageContainer from "@frontend/components/ui/PageContainer";
import TopBar from "@frontend/components/ui/TopBar";
import TopBarGroup from "@frontend/components/ui/TopBarGroup";
import useBrowseView from "@frontend/hooks/query/useBrowseView";
import useQuerySort from "@frontend/hooks/query/useQuerySort";
import useDisplayedRooms from "@frontend/hooks/rooms/useDisplayedRooms";
import {
  BROWSE_VIEWS,
  NO_START_TIME,
  ROOM_LIST_PAGE_SIZE,
} from "@frontend/utils/constants";
import { styled } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { enAU } from "date-fns/locale";
import { parseAsString, useQueryState } from "nuqs";
import { Suspense } from "react";

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
  const { sortOptions, sortTitle, filterKeys, searchPlaceholder } =
    BROWSE_VIEWS[view];
  const [sort, setSort] = useQuerySort(sortOptions);
  const [query, setQuery] = useQueryState("q", parseAsString.withDefault(""));
  const [start, setStart] = useQueryState(
    "start",
    parseAsString.withDefault(""),
  );
  const startIsSet = start !== NO_START_TIME;
  const [date] = useQueryState("date", parseAsString.withDefault(""));

  return (
    <PageContainer maxWidth={false}>
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
            <RoomsView
              query={query}
              sort={sort}
              startIsSet={startIsSet}
              date={date}
            />
          )}
        </Tiles>
      </LocalizationProvider>
      {view === "buildings" && <BuildingDrawer date={date} />}
    </PageContainer>
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
  paddingBottom: theme.space.sm,
}));

export default Page;
