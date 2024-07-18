"use client";

import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/system";

import AllRoomsFilter from "../../components/AllRoomsFilter";
import Room from "../../components/AllRoomsRoom";
import RoomList from "../../components/AllRoomsRoomList";
import AllRoomsSearchBar from "../../components/AllRoomsSearchBar";

export default function Page() {
  return (
    <Container>
      <Stack>
        <StyledSearchBar>
          <AllRoomsSearchBar />
          <ManageSearchIcon />
          <></>
        </StyledSearchBar>

        <StyledBody>
          <AllRoomsFilter />
          <RoomList>
            <Room building="Ainsworth G03" string="Available Until 1:00pm" />
            <Room building="CSE Building K17" string="Available Until 1:00pm" />
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
  margin: theme.spacing(6, 5, 3.75),
  padding: theme.spacing(1.25),
  justifyContent: "space-between",
  alignItems: "center",
  [theme.breakpoints.down("xs")]: {
    spacing: 1,
  },
  [theme.breakpoints.up("xs")]: {
    spacing: 2,
  },
}));

const StyledBody = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  margin: theme.spacing(0, 4.25),
  padding: theme.spacing(2.5),
  justifyContent: "space-between",
  backgroundColor: "yellow",
}));
