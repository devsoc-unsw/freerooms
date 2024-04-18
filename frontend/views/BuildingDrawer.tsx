import { RoomStatus } from "@common/types";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";
import { Typography, TypographyProps, useMediaQuery } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import { styled, useTheme } from "@mui/material/styles";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Image, { ImageProps } from "next/image";
import Link from "next/link";
import React from "react";

import Button from "../components/Button";
import useBuildingStatus from "../hooks/useBuildingStatus";
import useRoom from "../hooks/useRoom";
import {
  selectCurrentBuilding,
  setCurrentBuilding,
} from "../redux/currentBuildingSlice";
import { selectDatetime, setDatetime } from "../redux/datetimeSlice";
import { useDispatch, useSelector } from "../redux/hooks";
import toSydneyTime from "../utils/toSydneyTime";

const AppBox = styled(Box)(({ theme }) => ({
  boxShadow: "none",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(3, 2, 2, 3),
}));

const MainBox = styled(Box)<BoxProps>({
  position: "relative",
  flex: 1,
  backgroundColor: "#FAFAFA",
});

const StyledImage = styled(Image)<ImageProps>({
  borderRadius: 10,
  width: "100%",
  height: "auto",
});

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
  height: 70,
  fontSize: 20,
  fontWeight: 500,
  backgroundColor: "#FFFFFF",
  color: "black",
  padding: theme.spacing(2, 2, 2, 3),
  margin: theme.spacing(1.5, 1),
  "&:hover": {
    border: "1px solid",
    borderColor: theme.palette.primary.main,
    cursor: "pointer",
  },
}));

const RoomBoxHeading = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
}));

const RoomBoxSubheading = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: 12,
  fontWeight: 400,
  paddingTop: 1,
}));

export const drawerWidth = 400;
const drawerWidthMobile = "100%";

const BuildingDrawer: React.FC<{ open: boolean }> = ({ open }) => {
  const dispatch = useDispatch();
  const datetime = useSelector(selectDatetime);
  const building = useSelector(selectCurrentBuilding);
  const { status: rooms } = useBuildingStatus(building?.id ?? "");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!building || !open) return <></>;

  const onClose = () => dispatch(setCurrentBuilding(null));

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

  const RoomAvailabilityBox: React.FC<{
    roomNumber: string;
    roomStatus: RoomStatus;
  }> = ({ roomNumber, roomStatus }) => {
    const date = new Date(roomStatus.endtime);
    const hoursMinutes = date.toLocaleTimeString("en-AU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const roomStatusColor = {
      free: "#2AA300",
      busy: "#D30000",
      soon: "#ffa600",
    };

    const roomStatusMessage = {
      free: "Available",
      busy: "Unavailable",
      soon: "Available Soon",
    };

    const untilMessage = {
      free: hoursMinutes == "Invalid Date" ? "" : "until " + hoursMinutes,
      busy: hoursMinutes == "Invalid Date" ? "" : "until " + hoursMinutes,
      soon: "at " + hoursMinutes,
    };

    const { room } = useRoom(`${building.id}-${roomNumber}`);

    return (
      <Link href={`/room/${building.id}-${roomNumber}`}>
        <IndiviRoomBox>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              paddingRight: 1,
            }}
          >
            <RoomBoxHeading>{roomNumber}</RoomBoxHeading>
            <RoomBoxSubheading>{!room ? "" : room.name}</RoomBoxSubheading>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                paddingRight: 1,
              }}
            >
              <RoomBoxHeading
                sx={{ color: roomStatusColor[roomStatus.status] }}
              >
                {roomStatusMessage[roomStatus.status]}
              </RoomBoxHeading>
              <RoomBoxSubheading
                sx={{ color: roomStatusColor[roomStatus.status] }}
              >
                {untilMessage[roomStatus.status]}
              </RoomBoxSubheading>
            </Box>
            <ChevronRightIcon style={{ color: "grey" }} />
          </Box>
        </IndiviRoomBox>
      </Link>
    );
  };

  return (
    <Drawer
      sx={{
        width: isMobile ? drawerWidthMobile : drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isMobile ? drawerWidthMobile : drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="right"
      open={true}
      aria-label="building-drawer"
    >
      <Divider />
      <MainBox>
        <AppBox>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: 19, fontWeight: 500 }}>
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
              onChange={(value) =>
                value && dispatch(setDatetime(toSydneyTime(value)))
              }
              renderInput={customTextField}
            />
            <div style={{ width: 10 }} />
            <TimePicker
              value={datetime}
              onChange={(value) =>
                value && dispatch(setDatetime(toSydneyTime(value)))
              }
              renderInput={customTextField}
            />
          </div>
        </LocalizationProvider>

        <RoomBox>
          {rooms ? (
            Object.keys(rooms).map((roomNumber) => (
              <RoomAvailabilityBox
                key={roomNumber}
                roomNumber={roomNumber}
                roomStatus={rooms[roomNumber]}
              />
            ))
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
    </Drawer>
  );
};

export default BuildingDrawer;
