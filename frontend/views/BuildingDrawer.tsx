import type { Building } from "@common/types";
import ViewOnMapButton from "@frontend/components/navigation/ViewOnMapButton";
import Button from "@frontend/components/ui/Button";
import useBuildingStatus from "@frontend/hooks/useBuildingStatus";
import {
  selectCurrentBuilding,
  setCurrentBuilding,
} from "@frontend/redux/currentBuildingSlice";
import { useDispatch, useSelector } from "@frontend/redux/hooks";
import RoomAvailabilityBox from "@frontend/views/RoomAvailabilityBox";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import { Slide, Typography, useMediaQuery } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import { styled, useTheme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import Image, { ImageProps } from "next/image";

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
  backgroundColor: theme.colours.surface.muted,
  margin: 10,
  padding: theme.spacing(0.5),
}));

const CloseButton = styled(Button)(({ theme }) => ({
  backgroundColor: alpha(theme.colours.text.secondary, 0.5),
}));

const DirectionsButton = styled(Button)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1.5),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,

  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

type BuildingDrawerProps = {
  onGetDirections?: (building: Building) => void | Promise<void>;
  isDirectionsLoading?: boolean;
  date?: string;
};

const formatRoomNumber = (room: string): {
  prefixRank: number;
  num: number;
  suffix: string
} => {
  const room_order = ['B', 'LG', 'G', 'M'];

  // Regex pattern to match prefix (letter), number, suffix (letter)
  const match = room.match(/^([A-Za-z]*)(\d+)([A-Za-z]*)$/);
  if (!match) {
    return { prefixRank: room_order.length, num: 0, suffix: '' };
  }

  const prefix = match[1];
  const num = parseInt(match[2]);
  const suffix = match[3];

  // Get ordering based on prefix
  const rankIndex = room_order.indexOf(prefix.toUpperCase());

  return {
    prefixRank: rankIndex === -1 ? room_order.length : rankIndex,
    num,
    suffix,
  };
}

const sortRoomNumbers = (rooms: string[]): string[] => {
  return [...rooms].sort((a, b) => {
    const sortedA = formatRoomNumber(a);
    const sortedB = formatRoomNumber(b);

    // Sort by prefix, then by the room number, then by suffix (if provided)
    if (sortedA.prefixRank !== sortedB.prefixRank) {
      return sortedA.prefixRank - sortedB.prefixRank;
    }

    if (sortedA.num !== sortedB.num) {
      return sortedA.num - sortedB.num;
    }
    
    return sortedA.suffix.localeCompare(sortedB.suffix);
  });
}

const drawerWidth = 400;
const drawerWidthMobile = "100%";

const BuildingDrawer: React.FC<BuildingDrawerProps> = ({
  onGetDirections,
  isDirectionsLoading = false,
  date,
}) => {
  const dispatch = useDispatch();
  const building = useSelector(selectCurrentBuilding);
  const { status: rooms } = useBuildingStatus(building?.id ?? "");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!building) {
    return <></>;
  }

  const onClose = () => {
    dispatch(setCurrentBuilding(null));
  };

  const handleGetDirections = () => {
    if (!onGetDirections) {
      return;
    }

    void onGetDirections(building);
  };

  return (
    <Drawer
      sx={{
        width: isMobile ? drawerWidthMobile : drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isMobile ? drawerWidthMobile : drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "transparent",
          boxShadow: "none",
          backgroundImage: "none",
          borderLeft: "none",
          overflowX: "hidden",
          overflowY: "auto",
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

          <div style={{ margin: 10 }}>
            <StyledImage
              alt={`Image of building ${building.id}`}
              src={`/assets/building_photos/${building.id}.webp`}
              width={946}
              height={648}
              style={{ objectFit: "cover" }}
              priority={true}
            />

            {onGetDirections ? (
              <DirectionsButton
                disabled={isDirectionsLoading}
                startIcon={
                  isDirectionsLoading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <DirectionsWalkIcon />
                  )
                }
                onClick={handleGetDirections}
              >
                {isDirectionsLoading
                  ? "Getting directions..."
                  : "Get Directions"}
              </DirectionsButton>
            ) : (
              <ViewOnMapButton buildingId={building.id} variant="full-width" />
            )}
          </div>

          <RoomBox>
            {rooms ? (
              sortRoomNumbers(Object.keys(rooms.roomStatuses)).map((roomNumber) => (
                <RoomAvailabilityBox
                  key={roomNumber}
                  roomNumber={roomNumber}
                  roomStatus={rooms.roomStatuses[roomNumber]}
                  buildingId={building.id}
                  date={date}
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
