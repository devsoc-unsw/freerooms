import BottomSheet, { SheetStage } from "@frontend/components/map/BottomSheet";
import ViewOnMapButton from "@frontend/components/navigation/ViewOnMapButton";
import RoomAvailabilityBox from "@frontend/components/rooms/RoomAvailabilityBox";
import Button from "@frontend/components/ui/Button";
import useBuildingStatus from "@frontend/hooks/buildings/useBuildingStatus";
import { useDispatch, useSelector } from "@frontend/redux/hooks";
import {
  selectCurrentBuilding,
  setCurrentBuilding,
} from "@frontend/redux/slices/currentBuildingSlice";
import {
  formatWalkingDistance,
  formatWalkingDuration,
} from "@frontend/utils/walkingRange";
import CloseIcon from "@mui/icons-material/Close";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import { Skeleton, Slide, Typography, useMediaQuery } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { styled, useTheme } from "@mui/material/styles";
import type { Building } from "common/types";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

const AppBox = styled(Box)(({ theme }) => ({
  boxShadow: "none",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingTop: theme.space.lg,
  paddingRight: theme.space.md,
  paddingBottom: theme.space.md,
  paddingLeft: theme.space.md,
  width: "100%",
  boxSizing: "border-box",
}));

const MainBox = styled(Box)<BoxProps>(({ theme }) => ({
  position: "relative",
  flex: 1,
  backgroundColor: theme.palette.background.default,
}));

const BodyBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.space.md,
  paddingLeft: theme.space.md,
  paddingRight: theme.space.md,
  paddingBottom: theme.space.lg,
}));

const StyledImage = styled(Image)<ImageProps>(({ theme }) => ({
  borderRadius: theme.radius.card,
  width: "100%",
  height: "auto",
}));

const StatusBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "right",
  alignItems: "center",
  borderRadius: theme.radius.pill,
  paddingLeft: theme.space.md,
  paddingRight: theme.space.md,
}));

const RoomBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: `${theme.space.md}px`,
  paddingLeft: theme.space.md,
  paddingRight: theme.space.md,
  marginTop: 0,
  marginBottom: 0,
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.colours.text.primary,
}));

const DirectionsButton = styled(Button)(({ theme }) => ({
  width: "100%",
  marginTop: 0,
  marginBottom: 0,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,

  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const PeekRow = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: theme.space.sm,
  paddingLeft: theme.space.md,
  paddingRight: theme.space.md,
}));

const PeekText = styled(Box)<BoxProps>(() => ({
  minWidth: 0,
}));

type BuildingDrawerProps = {
  onGetDirections?: (building: Building) => void | Promise<void>;
  isDirectionsLoading?: boolean;
  date?: string;
  distance?: number;
  duration?: number;
  isWalkingExact?: boolean;
  onCollapse?: (building: Building) => void;
  onClose?: (building: Building) => void;
};

const formatRoomNumber = (
  room: string
): {
  prefixRank: number;
  num: number;
  suffix: string;
} => {
  const room_order = ["B", "LG", "G", "M"];

  // Regex pattern to match prefix (letter), number, suffix (letter)
  const match = room.match(/^([A-Za-z]*)(\d+)([A-Za-z]*)$/);
  if (!match) {
    return { prefixRank: room_order.length, num: 0, suffix: "" };
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
};

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
};

const drawerWidth = 440;

const BuildingDrawer: React.FC<BuildingDrawerProps> = ({
  onGetDirections,
  isDirectionsLoading = false,
  date,
  distance,
  duration,
  isWalkingExact = false,
  onCollapse,
  onClose: onCloseProp,
}) => {
  const dispatch = useDispatch();
  const building = useSelector(selectCurrentBuilding);
  const { status: rooms } = useBuildingStatus(building?.id ?? "");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Sheet stage for the building it was set on, so a newly selected building opens at half
  const [sheet, setSheet] = useState<{
    buildingId: string;
    stage: SheetStage;
  } | null>(null);
  const sheetStage =
    sheet && sheet.buildingId === building?.id ? sheet.stage : "half";

  if (!building) {
    return <></>;
  }

  const onClose = () => {
    onCloseProp?.(building);
    dispatch(setCurrentBuilding(null));
  };

  const handleGetDirections = () => {
    if (!onGetDirections) {
      return;
    }

    void onGetDirections(building);
  };

  const header = (
    <AppBox>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            sx={(theme) => ({
              fontSize: 19,
              fontWeight: 500,
              color: theme.colours.text.primary,
            })}
          >
            {building.name}
          </Typography>
          {isMobile && rooms && (
            <Typography variant="body1" color="text.secondary">
              {`${rooms.numAvailable}/${Object.keys(rooms.roomStatuses).length} rooms available`}
            </Typography>
          )}
        </Box>
        <StatusBox>
          {!rooms ? (
            <CircularProgress size={20} thickness={5} disableShrink />
          ) : null}
        </StatusBox>
      </div>

      <CloseButton
        size="small"
        aria-label="Close"
        onClick={onClose}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <CloseIcon />
      </CloseButton>
    </AppBox>
  );

  const body = (
    <>
      <BodyBox>
        <StyledImage
          alt={`Image of building ${building.id}`}
          src={`/assets/building_photos/${building.id}.webp`}
          width={946}
          height={648}
          style={{ objectFit: "cover" }}
          sx={isMobile ? { height: 160 } : undefined}
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
            {isDirectionsLoading ? "Getting directions..." : "Get Directions"}
          </DirectionsButton>
        ) : (
          <ViewOnMapButton buildingId={building.id} variant="full-width" />
        )}
      </BodyBox>

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
              padding: `${theme.space.sm}px`,
            }}
          >
            Loading...
          </Typography>
        )}
      </RoomBox>
    </>
  );

  if (isMobile) {
    // Ranges for Matrix estimates, exact numbers once a route has loaded
    const durationText =
      duration != null ? formatWalkingDuration(duration, isWalkingExact) : null;
    const distanceText =
      distance != null ? formatWalkingDistance(distance, isWalkingExact) : null;

    return (
      <BottomSheet
        stage={sheetStage}
        onStageChange={(stage) => {
          if (stage === "peek" && sheetStage !== "peek") {
            onCollapse?.(building);
          }
          setSheet({ buildingId: building.id, stage });
        }}
        handleContent={
          sheetStage === "peek" ? (
            <PeekRow>
              <PeekText>
                {isDirectionsLoading ? (
                  // Route time and distance are on their way
                  <>
                    <Skeleton
                      data-testid="walking-skeleton"
                      variant="text"
                      width={110}
                      sx={{ typography: "h3" }}
                    />
                    <Skeleton
                      data-testid="walking-skeleton"
                      variant="text"
                      width={80}
                      sx={{ typography: "h4" }}
                    />
                  </>
                ) : (
                  <>
                    <Typography variant="h3" noWrap>
                      {durationText ?? distanceText ?? building.name}
                    </Typography>
                    {durationText && distanceText && (
                      <Typography
                        variant="h4"
                        color="text.secondary"
                        sx={{ fontWeight: "fontWeightRegular" }}
                      >
                        ({distanceText})
                      </Typography>
                    )}
                  </>
                )}
              </PeekText>

              <CloseButton
                size="small"
                aria-label="Close"
                onClick={onClose}
                onPointerDown={(event) => event.stopPropagation()}
              >
                <CloseIcon />
              </CloseButton>
            </PeekRow>
          ) : (
            header
          )
        }
      >
        {/* Building details only appear once the sheet has snapped up from peek */}
        {sheetStage !== "peek" && body}
      </BottomSheet>
    );
  }

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "transparent",
          boxShadow: "none",
          backgroundImage: "none",
          borderLeft: "none",
          overflowX: "hidden",
          overflowY: "auto",
        },
      }}
      anchor="right"
      open={true}
      aria-label="building-drawer"
      onClose={onClose}
      // when modal open, the scroll bar is hidden, which cause the page to shift left slightly
      // this option when enabled disable that behaviour, with the tradeoff being users can scroll in the backdrop
      // see https://github.com/mui/material-ui/issues/10000
      disableScrollLock={true}
    >
      <Slide in={true} direction="left">
        <MainBox>
          {header}
          {body}
        </MainBox>
      </Slide>
    </Drawer>
  );
};

export default BuildingDrawer;
