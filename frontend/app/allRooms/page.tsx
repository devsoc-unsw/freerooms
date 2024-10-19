"use client";

import SearchIcon from "@mui/icons-material/Search";
import { CircularProgress, useMediaQuery } from "@mui/material";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled, useTheme } from "@mui/system";
import useAllRooms from "hooks/useAllRooms";
import { useMemo, useState } from "react";

import AllRoomsFilter from "../../components/AllRoomsFilter";
import AllRoomsFilterMobile from "../../components/AllRoomsFilterMobile";
import Room from "../../components/AllRoomsRoom";
import RoomList from "../../components/AllRoomsRoomList";
import AllRoomsSearchBar from "../../components/AllRoomsSearchBar";
import { useSelector } from "react-redux";
import { selectFilters } from "redux/filtersSlice";

export default function Page() {
  const filters = useSelector(selectFilters);
  const { rooms, isValidating, error } = useAllRooms(filters);
  const centred = isValidating ? "center" : "default"
  // const displayMobile = useMediaQuery(useTheme().breakpoints.down("md"));

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
         <AllRoomsFilter filters={filters}/>
          {
            <RoomList alignItems={centred} justifyContent={centred}>
              {isValidating ?
              <CircularProgress size={50} thickness={5} disableShrink />
              : roomsDisplay}
            </RoomList>
          }
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
  gap: theme.spacing(2),
  // [theme.breakpoints.down("md")]: {
  //   flexDirection: "column",
  //   alignItems: "center",
  //   padding: theme.spacing(0, 2),
  // },
}));
