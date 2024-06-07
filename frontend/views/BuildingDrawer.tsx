import CloseIcon from "@mui/icons-material/Close";
import { Typography, TypographyProps, useMediaQuery } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { styled, useTheme } from "@mui/material/styles";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { TimePicker } from "@mui/x-date-pickers";
import { TimeField } from "@mui/x-date-pickers";
import { DesktopTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { DigitalClock } from "@mui/x-date-pickers/DigitalClock";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import Image, { ImageProps } from "next/image";
import * as React from "react";
import { useState } from "react";

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

export const drawerWidth = 400;
const drawerWidthMobile = "100%";

const BuildingDrawer: React.FC<{ open: boolean }> = ({ open }) => {
  const dispatch = useDispatch();
  const [age, setAge] = useState("");
  const [value, setValue] = useState<Dayjs | null>(dayjs("2022-04-17"));
  const datetime = useSelector(selectDatetime);
  const building = useSelector(selectCurrentBuilding);
  const { status: rooms } = useBuildingStatus(building?.id ?? "");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!building || !open) {
    return <></>;
  }

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

  const handleDateTimeChange = (value: Date | undefined) => {
    if (value && dayjs(value).isValid()) {
      dispatch(setDatetime(toSydneyTime(value)));
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
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

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              margin: 10,
            }}
          >
            <DesktopDatePicker
              format="DD/MM/YYYY"
              value={dayjs(datetime)}
              onChange={(value) =>
                value && dispatch(setDatetime(toSydneyTime(value.toDate())))
              }
            />
            <DesktopTimePicker
              label="Time"
              value={dayjs(datetime)}
              onChange={(value) =>
                value && dispatch(setDatetime(toSydneyTime(value.toDate())))
              }
              slots={{ digitalClockItem: () => <DigitalClock /> }}
            />
            <TimePicker
              label="Time"
              value={dayjs(datetime)}
              onChange={(value) =>
                value && dispatch(setDatetime(toSydneyTime(value.toDate())))
              }
              slots={{ digitalClockItem: () => <DigitalClock /> }}
            />
            <div style={{ width: 10 }} />
            {/* <Box sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Time</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={age}
                  label="Time"
                  onChange={handleChange}
                >
                  <DigitalClock
                    skipDisabled
                    minTime={dayjs("2022-04-17T09:00")}
                    maxTime={dayjs("2022-04-17T22:00")}
                    timeStep={30}
                  />
                </Select>
              </FormControl>
            </Box> */}
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
    </Drawer>
  );
};

export default BuildingDrawer;
