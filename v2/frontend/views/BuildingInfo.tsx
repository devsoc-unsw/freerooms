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

const INITIALISING = -2;
const FAILED = -1;

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.getContrastText(theme.palette.background.default),
  boxShadow: "none",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2, 1),
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
  position: "absolute",
  top: 0,
  right: 0,
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

const BuildingInfo: React.FC<{
  id: string;
}> = ({ id }) => {
  const [date, setDate] = React.useState<DateTime | null>(null);
  React.useEffect(() => {
    setDate(DateTime.now());
  }, []);
  const [sort, setSort] = React.useState<"name" | "available">("name");

  const { data: buildingsData, error: buildingsError } =
    useSWR<BuildingReturnData>(server + "/buildings");
  const [building, setBuilding] = React.useState<Building | null>(null);

  React.useEffect(() => {
    buildingsData!.buildings
      .find((building) => building.id === id)
      .then((building) => setBuilding(building));
  }, [buildingsData, id]);

  const { data: roomsData, error: roomsError } =
    useSWR<BuildingRoomReturnStatus>({
      url: server + "/buildings/" + id,
      config: { params: { datetime: date.toFormat("yyyy-MM-dd HH:mm") } },
    });

  const [allRooms, setAllRooms] = React.useState<Room[]>([]);
  const [availableRooms, setAvailableRooms] = React.useState<Room[]>([]);
  const [unavailableRooms, setUnavailableRooms] = React.useState<Room[]>([]);

  const filterRoomsAvailable = (rooms: Room[], filterStatus: RoomStatus) =>
    rooms.filter((v) => v.status === filterStatus);

  /*const updateDateTime = async () => {
    this.availableRooms = this.filterRoomsAvailable(this.allRooms, "free");
    this.availableSoonRooms = this.filterRoomsAvailable(this.allRooms, "soon");
    this.unavailableRooms = this.filterRoomsAvailable(this.allRooms, "busy");
  };*/

  React.useEffect(() => {
    // update rooms
  }, [roomsData]);

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
      <AppBar
        position="fixed"
        sx={(theme) => ({
          borderBottom: "1px solid #e0e0e0",
        })}
      >
        <StatusBox>
          {roomsData ? (
            <>
              {roomsError ? (
                <StatusDot
                  colour={
                    availableRooms.length >= 5
                      ? "green"
                      : availableRooms.length !== 0
                      ? "orange"
                      : "red"
                  }
                />
              ) : null}
              <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                {roomsData && !roomsError
                  ? `${allRooms.length} room${
                      allRooms.length === 1 ? "" : "s"
                    } available`
                  : "data unavailable"}
              </Typography>
            </>
          ) : (
            <CircularProgress size={20} thickness={5} disableShrink />
          )}
        </StatusBox>
      </AppBar>
      <StyledImage
        src={`/assets/building_photos/${id}.png`}
        layout="fill"
        objectFit="cover"
        priority={true}
      />

      <TitleBox>
        <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
          {building ? building.name : ""}
        </Typography>
      </TitleBox>
    </MainBox>
  );
};

export default BuildingInfo;
