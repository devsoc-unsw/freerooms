"use client";

import { Alert, Button, Typography } from "@mui/material";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/system";
import AllRoomsSearchBar from "components/AllRoomsSearchBar";
import useAllRooms from "hooks/useAllRooms";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectFilters } from "redux/filtersSlice";

import AllRoomsFilter from "../../components/AllRoomsFilter";
import Room from "../../components/AllRoomsRoom";
import RoomList from "../../components/AllRoomsRoomList";

export default function Page() {
  const filters = useSelector(selectFilters);
  const { rooms, isValidating } = useAllRooms(filters);
  const [visibleRooms, setVisibleRooms] = useState(20);

  const roomsDisplay = useMemo(() => {
    if (!rooms) return;
    const availableRooms = Object.entries(rooms).filter(
      (room) => room[1].status !== "busy"
    );

    if (availableRooms.length === 0) {
      return (
        <Alert severity="error" sx={{ marginTop: 2 }}>
          No rooms satisfying current filters
        </Alert>
      );
    }

    const roomEntries = availableRooms.slice(0, visibleRooms);

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
    <Stack alignItems="center">
      <Stack marginTop={4} paddingX={1}>
        <Typography fontWeight="bold" variant="h4">
          All Free Rooms
        </Typography>
        <Typography marginTop={1} variant="body1">
          Not looking for a specific building? See all free rooms in this easy
          to search list!
        </Typography>
        <StyledBody>
          <AllRoomsFilter filters={filters} />
          <RoomList isValidating={isValidating}>
            <AllRoomsSearchBar />
            {roomsDisplay}
            {visibleRooms < totalRooms && (
              <Button
                variant="outlined"
                onClick={handleLoadMore}
                sx={{ marginY: 1 }}
              >
                Load More Rooms
              </Button>
            )}
          </RoomList>
        </StyledBody>
      </Stack>
    </Stack>
  );
}

const StyledBody = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  marginTop: "30px",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));
