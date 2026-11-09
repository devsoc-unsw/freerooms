import { Building, BuildingStatus } from "@common/types";
import useBuilding from "@frontend/hooks/buildings/useBuilding";
import useBuildingStatus from "@frontend/hooks/buildings/useBuildingStatus";
import { useDispatch, useSelector } from "@frontend/redux/hooks";
import {
  selectCurrentBuilding,
  setCurrentBuilding,
} from "@frontend/redux/slices/currentBuildingSlice";
import { getNumFreerooms, getTotalRooms } from "@frontend/utils/utils";
import {
  formatWalkingDistance,
  formatWalkingDuration,
} from "@frontend/utils/walkingRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { alpha, Fade, useMediaQuery } from "@mui/material";
import { Typography, TypographyProps } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import { Footprints } from "lucide-react";
import Image, { ImageProps } from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import Button from "@frontend/components/ui/Button";

const MarkerHoverMainBox = styled(Box)<BoxProps>(({ theme }) => ({
  position: "absolute",
  flex: 1,
  backgroundColor: theme.colours.map.popup,
  height: 200,
  width: 300,
  borderRadius: 20,
  overflow: "hidden",
  boxShadow: theme.shadows[2],
}));

const MarkerHoverImage = styled(Image)<ImageProps>(() => ({
  objectFit: "cover",
}));

const MarkerHoverInfoBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  pointerEvents: "none",
  alignItems: "center",
  fontSize: "small",
  gap: theme.space.sm,
  marginTop: theme.space.xs,
}));

const MarkerHoverPill = styled(Box)<BoxProps>(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: theme.space.xs,
  padding: theme.space.xs,
  paddingLeft: theme.space.sm,
  paddingRight: theme.space.sm,
  borderRadius: theme.radius.pill,
  backgroundColor: theme.colours.accent.tertiary,
  color: theme.colours.text.primary,
}));

const MarkerHoverPillText = styled(Typography)<TypographyProps>(
  ({ theme }) => ({
    fontSize: 12,
    fontWeight: 500,
    color: theme.colours.text.primary,
  })
);

const MarkerHoverTitleBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: theme.colours.background.primary,
  color: theme.colours.text.primary,
  borderRadius: 8,
  padding: 8,
  paddingLeft: 12,
  paddingRight: 12,
  margin: 10,
  pointerEvents: "none",
}));

{ /* Create own component file if needed */ }
const DirectionsButton = styled(Button)(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(1.5),
  padding: `${theme.space.sm}px ${theme.space.xs}px`,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: "14px",
  fontWeight: theme.typography.fontWeightBold,

  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));



const MapMarker: React.FC<{
  buildingId: string;
  // Walking distance (m) and duration (s)
  distance: number | undefined;
  duration: number | undefined;
  // True once these come from a loaded route rather than a Matrix estimate
  isWalkingExact?: boolean;
  currentHover: Building | null;
  setCurrentHover: (building: Building | null) => void;
  isRouteDestination?: boolean;
  // Called when this marker is tapped or clicked
  onSelect?: (building: Building) => void;
}> = ({
  buildingId,
  distance,
  duration,
  isWalkingExact = false,
  currentHover,
  setCurrentHover,
  isRouteDestination = false,
  onSelect,
}) => {
  // Get building data
  const { building } = useBuilding(buildingId);
  const { status: liveStatus } = useBuildingStatus(buildingId);
  const theme = useTheme();
  const router = useRouter();

  // This one uses stale data so markers don't disappear
  const status: BuildingStatus | undefined = liveStatus;
  const freerooms = getNumFreerooms(status);
  const totalRooms = getTotalRooms(status);
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const dispatch = useDispatch();
  const currentBuilding = useSelector(selectCurrentBuilding);
  const isCurrentBuilding = currentBuilding?.id === building?.id;

  // Visible if selected or current destination
  const isSelected = isCurrentBuilding || isRouteDestination;

  // Mobile shows the building in the bottom sheet instead of the hover card
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const showPopup = !isMobile && currentHover?.id === building?.id;
  const [appearAbove, setAppearAbove] = React.useState(false);
  const [appearLeft, setAppearLeft] = React.useState(false);

  const handleSelectBuilding = () => {
    if (building) {
      onSelect?.(building);
    }
    dispatch(setCurrentBuilding(building || null));
    params.set("building", buildingId); // Add or update the 'query' param
    router.push(`/map?${params.toString()}`);
  };

  const colour =
    freerooms >= 5
      ? theme.colours.map.availability.available
      : freerooms !== 0
        ? theme.colours.map.availability.soon
        : theme.colours.map.availability.unavailable;

  if (!building) {
    return <></>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
      }}
      onMouseEnter={(e) => {
        setCurrentHover(building);

        const markerScreenPos = e.currentTarget.getBoundingClientRect();

        if (markerScreenPos.bottom + 200 > window.innerHeight) {
          setAppearAbove(true);
        } else {
          setAppearAbove(false);
        }

        if (markerScreenPos.right + 300 > window.innerWidth) {
          setAppearLeft(true);
        } else {
          setAppearLeft(false);
        }
      }}
      onMouseLeave={() => {
        setCurrentHover(null);
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 500,
          translate: isSelected ? "0px -10px" : "0px 0px",
          transition: "all 0.2s ease-in-out",
          textShadow:
            theme.palette.mode === "light"
              ? `-.5px -.5px 1px ${theme.colours.neutral.white}, .5px -.5px 1px ${theme.colours.neutral.white}, -.5px .5px 1px ${theme.colours.neutral.white}, .5px .5px 1px ${theme.colours.neutral.white}`
              : "",
          color: theme.palette.text.primary,
        }}
      >
        {building.name}
      </Typography>

      <Box
        sx={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          border: isSelected
            ? `5px solid ${colour}`
            : `4px solid ${theme.colours.neutral.white}`,
          backgroundColor: isSelected ? theme.colours.neutral.white : colour,
          scale: isSelected ? 2 : 1,
          transition: "all 0.2s ease-in-out",
          boxShadow: isSelected ? `0px 0px 6px 4px ${alpha(colour, 0.5)}` : "",
          position: "relative",

          "&:hover": {
            cursor: "pointer",
          },
        }}
        onClick={handleSelectBuilding}
        data-testid="map-marker-dot"
      />

      <Fade in={showPopup} timeout={200}>
        <div
          style={{
            position: "relative",
            bottom: -3,
          }}
        >
          <MarkerHover
            building={building}
            freerooms={freerooms}
            totalRooms={totalRooms}
            distance={distance}
            duration={duration}
            isWalkingExact={isWalkingExact}
            appearLeft={appearLeft}
            appearAbove={appearAbove}
            onClick={handleSelectBuilding}
          />
        </div>
      </Fade>
    </div>
  );
};

const MarkerHover: React.FC<{
  building: Building;
  freerooms: number;
  totalRooms: number;
  distance: number | undefined;
  duration: number | undefined;
  isWalkingExact: boolean;
  appearLeft?: boolean;
  appearAbove?: boolean;
  onClick: () => void;
}> = ({
  building,
  freerooms,
  totalRooms,
  distance,
  duration,
  isWalkingExact,
  appearLeft = false,
  appearAbove = false,
  onClick,
}) => {
  return (
    <MarkerHoverMainBox
      onClick={onClick}
      style={{
        cursor: "pointer",
        left: appearLeft ? "auto" : 0,
        right: appearLeft ? 0 : "auto",
        top: appearAbove ? "auto" : 0,
        bottom: appearAbove ? 24 : "auto",
      }}
    >
      <MarkerHoverImage
        alt={`Image of ${building.id}`}
        src={`/assets/building_photos/${building.id}.webp`}
        fill={true}
        sizes="300px"
        priority={true}
      />
      <MarkerHoverTitleBox>
        <Typography sx={{ fontSize: 20, fontWeight: 800 }}>
          {building.name}
        </Typography>
        <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
          {`${freerooms}/${totalRooms} available`}
        </Typography>
        <MarkerHoverInfoBox>
          {duration != null && (
            <MarkerHoverPill>
              <AccessTimeIcon sx={{ fontSize: 18 }} />
              <MarkerHoverPillText>
                {formatWalkingDuration(duration, isWalkingExact)}
              </MarkerHoverPillText>
            </MarkerHoverPill>
          )}

          {distance != null && (
            <MarkerHoverPill>
              <Footprints size={18} />
              <MarkerHoverPillText>
                {formatWalkingDistance(distance, isWalkingExact)}
              </MarkerHoverPillText>
            </MarkerHoverPill>
          )}

        </MarkerHoverInfoBox>
      </MarkerHoverTitleBox>
    </MarkerHoverMainBox>
  );
};

export default MapMarker;
