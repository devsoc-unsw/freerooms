import React, { useRef } from "react";
import axios from "axios";
import useSWR from "swr";
import { server } from "../config";
import {
  Room,
  RoomStatus,
  Building,
  BuildingReturnData,
  BuildingRoomReturnStatus,
} from "../types";

import { styled } from "@mui/material/styles";
import Image, { ImageProps } from "next/image";
import Box, { BoxProps } from "@mui/material/Box";
import StatusDot from "../components/StatusDot";
import { Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import Button from "../components/Button";

import { DateTime } from "luxon";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

const INITIALISING = -2;
const FAILED = -1;

const AppBox = styled(Box)(({ theme }) => ({
  boxShadow: "none",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(3, 2, 2, 3),
}));

const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
  position: "relative",
  flex: 1,
  backgroundColor: "#FAFAFA",
}));

const StyledImage = styled(Image)<ImageProps>(({ theme }) => ({
  borderRadius: 10,
}));

const StatusBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "right",
  alignItems: "center",
  borderRadius: 15,
  padding: theme.spacing(0, 2, 0, 2),
}));

const RoomBox = styled(Box)<BoxProps>(({ theme }) => ({
  borderRadius: 10,
  backgroundColor: "#F1F1F1",
  margin: 10,
  padding: theme.spacing(0.5),
}));

const IndiviRoomBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: 10,
  fontSize: 20,
  fontWeight: 500,
  backgroundColor: "#FFFFFF",
  color: "black",
  padding: theme.spacing(2, 3),
  margin: theme.spacing(1.5, 1),
}));

const BuildingInfo: React.FC<{
  building: Building | null;
  onClose?: () => void;
}> = ({ building, onClose }) => {
  if (!building) return <></>;

  const [value, setValue] = React.useState<Date | null>(new Date());
  const [sort, setSort] = React.useState<"name" | "available">("name");
  const [roomsData, setRoomsData] = React.useState<
    BuildingRoomReturnStatus | undefined
  >();
  const [roomsError, setRoomsError] = React.useState<string | undefined>();

  const fetchRooms = async () => {
    axios
      .get(server + "/buildings/" + building!.id, {
        params: {
          datetime: `${DateTime.fromJSDate(value!).toFormat(
            "yyyy-MM-dd"
          )}T${DateTime.fromJSDate(value!).toFormat("HH:mm")}`,
        },
      })
      .then((res) => setRoomsData(res.data))
      .catch((err) => setRoomsError(err.message));
  };

  React.useEffect(() => {
    setRoomsData(undefined);
  }, [building]);

  React.useEffect(() => {
    setRoomsData(undefined);
    fetchRooms();
  }, [building, value]);

  const customTextField = (
    params: JSX.IntrinsicAttributes & TextFieldProps
  ) => (
    <TextField
      {...params}
      sx={{
        svg: { color: "#000000" },
        input: { color: "#000000" },
      }}
    />
  );

  return (
    <MainBox>
      <AppBox>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: 16, fontWeight: 500 }}>
            {building!.name}
          </Typography>
          <StatusBox>
            {!roomsData ? (
              // loading
              <CircularProgress size={20} thickness={5} disableShrink />
            ) : null}
          </StatusBox>
        </div>
        <Button aria-label="Close" onClick={onClose}>
          <CloseIcon />
        </Button>
      </AppBox>

      <div
        style={{
          margin: 10,
        }}
      >
        <StyledImage
          src={`/assets/building_photos/${building!.id}.jpg`}
          width="946px"
          height="648px"
          objectFit="cover"
          priority={true}
        />
      </div>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 10,
          }}
        >
          <DesktopDatePicker
            inputFormat="dd/MM/yyyy"
            value={value}
            onChange={(newValue) => setValue(newValue)}
            renderInput={customTextField}
          />
          <div style={{ width: 10 }} />
          <TimePicker
            value={value}
            onChange={(newValue) => setValue(newValue)}
            renderInput={customTextField}
          />
        </div>
      </LocalizationProvider>

      <RoomBox>
        {roomsData ? (
          Object.keys(roomsData["rooms"]).map((room_name) => {
            const room = roomsData["rooms"][room_name];
            return (
              <IndiviRoomBox>
                {room_name}{" "}
                <Typography
                  sx={{ fontSize: 16, fontWeight: 500 }}
                  style={{
                    color: room["status"] === "free" ? "#2AA300" : "#D30000",
                  }}
                >
                  {room["status"] === "free" ? "Available" : "Unavailable"}
                </Typography>
              </IndiviRoomBox>
            );
          })
        ) : (
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 500,
              textAlign: "center",
              padding: 10,
            }}
          >
            Loading...
          </Typography>
        )}
      </RoomBox>
    </MainBox>
  );
};

/* 
(
<>
  {roomsError
    ? null
    : () => {
        const rooms =
          roomsData && roomsData["rooms"]
            ? Object.values(roomsData["rooms"])
            : null;

        return (
          <StatusDot
            colour={
              rooms
                ? rooms.filter(
                    (r: { status: string }) => r.status === "free"
                  ).length >= 5
                  ? "green"
                  : rooms.filter(
                      (room: { status: string }) =>
                        room.status === "free"
                    ).length !== 0
                  ? "orange"
                  : "red"
                : "red"
            }
          />
        );
      }}
  <Typography
    sx={{ fontSize: 14, fontWeight: 500, opacity: 0.8 }}
  >
    {roomsData && !roomsError
      ? `${Object.values(roomsData["rooms"]).length}`
      : "data unavailable"}
  </Typography>
</>
)*/

export default BuildingInfo;
