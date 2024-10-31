"use client";

import SearchIcon from "@mui/icons-material/Search";
import { Button, CircularProgress } from "@mui/material";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/system";
import useAllRooms from "hooks/useAllRooms";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectFilters } from "redux/filtersSlice";

import AllRoomsFilter from "../../components/AllRoomsFilter";
import Room from "../../components/AllRoomsRoom";
import RoomList from "../../components/AllRoomsRoomList";
import AllRoomsSearchBar from "../../components/AllRoomsSearchBar";

export default function Page() {
  const filters = useSelector(selectFilters);
  const { rooms, isValidating } = useAllRooms(filters);
  const centred = isValidating ? "center" : "default";
  // const displayMobile = useMediaQuery(useTheme().breakpoints.down("md"));
  const [visibleRooms, setVisibleRooms] = useState(20);

  const roomsDisplay = useMemo(() => {
    if (!rooms) return;
    const roomEntries = Object.entries(rooms).slice(0, visibleRooms);
    return roomEntries.map(([roomId, { name, status, endtime }]) => {
      return (
        <Room
          key={roomId}
          roomNumber={roomId}
          name={name}
          status={status}
          endtime={endtime}
        />
      );
    });
  }, [rooms, visibleRooms]);

  const handleLoadMore = () => {
    setVisibleRooms((prev) => prev + 20);
  };

  const totalRooms = rooms ? Object.keys(rooms).length : 0;

  return (
    <Container>
      <Stack>
        <StyledSearchBar>
          <AllRoomsSearchBar />
          <SearchIcon />
        </StyledSearchBar>
        <StyledBody>
          <AllRoomsFilter filters={filters} />
          <RoomList isValidating={false}>
            {roomsDisplay}
            {visibleRooms < totalRooms && (
              <Button variant="contained" onClick={handleLoadMore}>
                Load More Rooms
              </Button>
            )}
          </RoomList>
        </StyledBody>
      </Stack>
    </Container>
  );
}

const StyledSearchBar = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  minWidth: "332px",
  borderRadius: 8,
  borderStyle: "solid",
  borderWidth: "thin",
  borderColor: theme.palette.text.secondary,
  margin: theme.spacing(6, 6.25, 3.75),
  padding: theme.spacing(1.25),
  justifyContent: "space-between",
  alignItems: "center",
  [theme.breakpoints.down("xs")]: {
    spacing: 1,
    margin: theme.spacing(3, 6.25, 2),
  },
  [theme.breakpoints.up("xs")]: {
    spacing: 2,
  },
}));

const StyledBody = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  // flexWrap: "wrap",
  margin: theme.spacing(0, 4.25),
  padding: theme.spacing(2),
  justifyContent: "space-between",
  gap: theme.spacing(2),
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    // alignItems: "center",
    padding: theme.spacing(0, 2),
  },
}));
