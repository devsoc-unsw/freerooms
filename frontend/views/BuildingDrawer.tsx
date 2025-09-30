import CloseIcon from "@mui/icons-material/Close";
import { Slide, Typography, useMediaQuery } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import { styled, useTheme } from "@mui/material/styles";
import Image, { ImageProps } from "next/image";

import Button from "../components/Button";
import useBuildingStatus from "../hooks/useBuildingStatus";
import {
  selectCurrentBuilding,
  setCurrentBuilding,
} from "../redux/currentBuildingSlice";
import { useDispatch, useSelector } from "../redux/hooks";
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
      anchor={isMobile ? "bottom" : "right"}
      open={true}
      aria-label="building-drawer"
      onClose={onClose}
      // when modal open, the scroll bar is hidden, which cause the page to shift left slightly
      // this option when enabled disable that behaviour, with the tradeoff being users can scroll in the backdrop
      // see https://github.com/mui/material-ui/issues/10000
      disableScrollLock={true}
    >
      <Slide in={true} direction={isMobile ? "up" : "left"}>
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

          <RoomBox>
            {rooms ? (
              Object.keys(rooms.roomStatuses).map((roomNumber) => (
                <RoomAvailabilityBox
                  key={roomNumber}
                  roomNumber={roomNumber}
                  roomStatus={rooms.roomStatuses[roomNumber]}
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
