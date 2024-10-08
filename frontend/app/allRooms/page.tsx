"use client";

import SearchIcon from "@mui/icons-material/Search";
import { useMediaQuery } from "@mui/material";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/system";
import useAllRooms from "hooks/useAllRooms";
import { useMemo } from "react";

import AllRoomsFilter from "../../components/AllRoomsFilter";
import AllRoomsFilterMobile from "../../components/AllRoomsFilterMobile";
import Room from "../../components/AllRoomsRoom";
import RoomList from "../../components/AllRoomsRoomList";
import AllRoomsSearchBar from "../../components/AllRoomsSearchBar";

export default function Page() {
  const { rooms, error } = useAllRooms();
  const roomsDisplay = useMemo(() => {
    if (!rooms) return;
    return Object.entries(rooms).map(([roomId, { name, status, endtime }]) => {
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
  }, [rooms]);

  return (
    <Container>
      <Stack>
        <StyledSearchBar>
          <AllRoomsSearchBar />
          <SearchIcon />
        </StyledSearchBar>
        <StyledBody>
          <Filter />
          <RoomList>{roomsDisplay}</RoomList>
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
  flexWrap: "wrap",
  margin: theme.spacing(0, 4.25),
  padding: theme.spacing(2),
  justifyContent: "space-between",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing(0, 2),
  },
}));

const Filter: React.FC<{}> = () => {
  const displayMobile = useMediaQuery(useTheme().breakpoints.down("md"));
  return <>{displayMobile ? <AllRoomsFilterMobile /> : <AllRoomsFilter />}</>;
};
