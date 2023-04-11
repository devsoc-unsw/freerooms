import CloseIcon from "@mui/icons-material/Close";
import { Typography } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Link from 'next/link';
import Image, { ImageProps } from "next/image";
import React from "react";

import Button from "../components/Button";
import { Building, BuildingStatus, RoomsReturnData } from "../types";

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
  width: "100%",
  height: "auto",
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
  datetime: Date | null;
  setDatetime: (datetime: Date | null) => void;
  roomStatusData: RoomsReturnData | undefined;
}> = ({ building, onClose, datetime, setDatetime, roomStatusData }) => {
  const [sort, setSort] = React.useState<"name" | "available">("name");
  const [rooms, setRooms] = React.useState<BuildingStatus | undefined>();
  const [roomsError, setRoomsError] = React.useState<string | undefined>();

  React.useEffect(() => {
    setRooms(undefined);
    if (!building) return;
    if (roomStatusData && building.id in roomStatusData) {
      setRooms(roomStatusData[building.id]);
    }
  }, [building, roomStatusData]);

  if (!building) return <></>;

  const customTextField = (
    params: JSX.IntrinsicAttributes & TextFieldProps,
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
            {!rooms ? (
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
          alt={`Image of building ${building.id}`}
          src={`/assets/building_photos/${building.id}.webp`}
          width={946}
          height={648}
          style={{ objectFit: "cover" }}
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
            value={datetime}
            onChange={(newValue) => setDatetime(newValue)}
            renderInput={customTextField}
          />
          <div style={{ width: 10 }} />
          <TimePicker
            value={datetime}
            onChange={(newValue) => setDatetime(newValue)}
            renderInput={customTextField}
          />
        </div>
      </LocalizationProvider>

      <RoomBox>
        {rooms ? (
          Object.keys(rooms).map((roomId) => {
            const room = rooms[roomId];
            console.log(`Room: ${building.id}-${roomId}`);
            return (
              <Link href={`/room/${building.id}-${roomId}`}>
                <IndiviRoomBox key={roomId}>
	                {roomId}{" "}
	                <Typography
	                  sx={{ fontSize: 16, fontWeight: 500 }}
	                  style={{
	                    color: room["status"] === "free" ? "#2AA300" : "#D30000",
	                  }}
	                >
	                  {room["status"] === "free" ? "Available" : "Unavailable"}
	                </Typography>
                </IndiviRoomBox>
              </Link>
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

export default BuildingInfo;
