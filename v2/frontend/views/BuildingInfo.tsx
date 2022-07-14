import React, { useRef } from "react";
import useSWR from "swr";
import { DateTime } from "luxon";
import { server } from "../config";
import {
  Room,
  RoomStatus,
  Building,
  BuildingReturnData,
  BuildingRoomReturnStatus,
} from "../types";

import Image, { ImageProps } from "next/image";
import { styled } from "@mui/material/styles";
import Box, { BoxProps } from "@mui/material/Box";
import StatusDot from "../components/StatusDot";
import { Typography } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import Button from "../components/Button";
import axios from "axios";

const INITIALISING = -2;
const FAILED = -1;

const AppBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.getContrastText(theme.palette.background.default),
  boxShadow: "none",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3, 1),
}));

const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
  position: "relative",
  flex: 1,
  backgroundColor: theme.palette.primary.main,
  height: 385,
  borderRadius: 10,
  "&:hover": {
    cursor: "pointer",
  },
}));

const StyledImage = styled(Image)<ImageProps>(({ theme }) => ({
  borderRadius: 10,
  transition: "all 0.1s ease-in-out",
  "&:hover": {
    opacity: 0.7,
  },
}));

const StatusBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 15,
  backgroundColor: "white",
  padding: 10,
  paddingLeft: 15,
  paddingRight: 15,
  margin: 10,
  pointerEvents: "none",
}));

const TitleBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  borderRadius: 10,
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: theme.palette.primary.main,
  color: "white",
  padding: 15,
  paddingLeft: 20,
  paddingRight: 20,
  margin: 10,
  pointerEvents: "none",
}));

const fetchTerm = (url: any, term: any) =>
  axios({ url, params: { term } }).then((res) => res.data);

const BuildingInfo: React.FC<{
  building: Building | null;
  onClose?: () => void;
}> = ({ building }) => {
  if (!building) return <></>;
  console.log(server + "/buildings/" + building!.id);

  const [date, setDate] = React.useState<DateTime>(DateTime.now());
  const [sort, setSort] = React.useState<"name" | "available">("name");
  const [rooms, setRooms] = React.useState<Room[]>([]);
  // BUGS HERE
  const { data: roomsData, error: roomsError } =
    useSWR<BuildingRoomReturnStatus>(server + "/buildings/" + building!.id);

  /*const sortRooms = (rooms: Room[]) => {
    if (sort === "name") {
      rooms.sort((a: Room, b: Room) => (a.name > b.name ? 1 : -1));
    } else {
      // free -> soon -> busy
      rooms.sort((a: Room, b: Room) => {
        // if status is the same then compare the room name
        if (a.status === b.status) {
          return b.name < a.name ? 1 : -1;
        }
        if (b.status === "free") return 1;
        if (a.status === "free") return -1;
        return b.status > a.status ? 1 : -1;
      });
    }
    return rooms;
  };*/

  return (
    <MainBox>
      <AppBox>
        <Button aria-label="Close">
          <CloseIcon />
        </Button>
      </AppBox>
      <StatusBox>
        {roomsData ? (
          <>
            {roomsError ? (
              <StatusDot
                colour={
                  rooms.filter((r) => r.status === "free").length >= 5
                    ? "green"
                    : rooms.filter((r) => r.status === "free").length !== 0
                    ? "orange"
                    : "red"
                }
              />
            ) : null}
            <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
              {roomsData && !roomsError
                ? `${rooms.length} room${
                    rooms.length === 1 ? "" : "s"
                  } available`
                : "data unavailable"}
            </Typography>
          </>
        ) : (
          <CircularProgress size={20} thickness={5} disableShrink />
        )}
      </StatusBox>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          margin: 10,
        }}
      >
        <StyledImage
          src={`/assets/building_photos/${building!.id}.png`}
          layout="fill"
          objectFit="cover"
          priority={true}
        />
      </div>

      <TitleBox>
        <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
          {building!.name}
        </Typography>
      </TitleBox>
    </MainBox>
  );
};

export default BuildingInfo;
