import CloseIcon from "@mui/icons-material/Close";
import { Slide, Typography, useMediaQuery } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import { styled, useTheme } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Image, { ImageProps } from "next/image";
import React from "react";

import Button from "../components/Button";
import useBuildingStatus from "../hooks/useBuildingStatus";
import {
  selectCurrentBuilding,
  setCurrentBuilding,
} from "../redux/currentBuildingSlice";
import { selectDatetime, setDatetime } from "../redux/datetimeSlice";
import { useDispatch, useSelector } from "../redux/hooks";
import toSydneyTime from "../utils/toSydneyTime";
import RoomAvailabilityBox from "./RoomAvailabilityBox";

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
  backgroundColor: theme.palette.background.default,
}));

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
  backgroundColor: theme.palette.mode === "light" ? "#F1F1F1" : "#2c2c2c",
  margin: 10,
  padding: theme.spacing(0.5),
}));

const CloseButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

const drawerWidth = 400;
const drawerWidthMobile = "100%";

const BuildingDrawer: React.FC = () => {
  const dispatch = useDispatch();
  const datetime = useSelector(selectDatetime);
  const building = useSelector(selectCurrentBuilding);
  const { status: rooms } = useBuildingStatus(building?.id ?? "");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!building) {
    return <></>;
  }

  const onClose = () => dispatch(setCurrentBuilding(null));

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
      anchor="right"
      open={true}
      aria-label="building-drawer"
    >
      <Slide in={true} direction="left">
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
                {building.name}
              </Typography>
              <StatusBox>
                {!rooms ? (
                  // loading
                  <CircularProgress size={20} thickness={5} disableShrink />
                ) : null}
              </StatusBox>
            </div>
            <CloseButton aria-label="Close" onClick={onClose}>
              <CloseIcon />
            </CloseButton>
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
                format="dd/MM/yyyy"
                value={datetime}
                onChange={(value) =>
                  value && dispatch(setDatetime(toSydneyTime(value)))
                }
                slotProps={{
                  textField: {
                    sx: {
                      svg: { color: theme.palette.text.primary },
                      input: { color: theme.palette.text.primary },
                    },
                  },
                }}
              />
              <div style={{ width: 10 }} />
              <TimePicker
                value={datetime}
                onChange={(value) =>
                  value && dispatch(setDatetime(toSydneyTime(value)))
                }
                slotProps={{
                  textField: {
                    sx: {
                      svg: { color: theme.palette.text.primary },
                      input: { color: theme.palette.text.primary },
                    },
                  },
                }}
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
                  buildingId={building.id}
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
      </Slide>
    </Drawer>
  );
};

export default BuildingDrawer;
