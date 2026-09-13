import { Building } from "@common/types";
import BuildingCard from "@frontend/components/rooms/BuildingCard";
import BuildingCardMobile from "@frontend/components/rooms/BuildingCardMobile";
import useBuildings from "@frontend/hooks/useBuildings";
import useStatus from "@frontend/hooks/useStatus";
import useUserLocation from "@frontend/hooks/useUserLocation";
import calculateDistance from "@frontend/utils/calculateDistance";
import { getNumFreerooms } from "@frontend/utils/utils";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";

const CardGrid = styled("div")(() => ({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gridGap: "20px",
}));

const getBuildingPosition = (building: Building): number | null => {
  const match = building.id.match(/(\d+)$/);

  if (!match) {
    return null;
  }

  return Number(match[1]);
};
const compareBuildingPosition = (
  a: Building,
  b: Building,
  direction: "lowerToUpper" | "upperToLower"
): number => {
  const aPosition = getBuildingPosition(a);
  const bPosition = getBuildingPosition(b);

  if (aPosition == null && bPosition == null) {
    return a.name.localeCompare(b.name);
  }

  if (aPosition == null) {
    return 1;
  }

  if (bPosition == null) {
    return -1;
  }

  const positionDiff = aPosition - bPosition;

  if (positionDiff !== 0) {
    return direction === "lowerToUpper" ? positionDiff : -positionDiff;
  }

  const longDiff = a.long - b.long;

  if (longDiff !== 0) {
    return direction === "lowerToUpper" ? longDiff : -longDiff;
  }

  return a.name.localeCompare(b.name);
};

const FlippableCard = React.forwardRef<HTMLDivElement, { buildingId?: string }>(
  ({ buildingId }, ref) => {
    return (
      <div ref={ref}>
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          <BuildingCardMobile buildingId={buildingId} />
        </Box>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          <BuildingCard buildingId={buildingId} />
        </Box>
      </div>
    );
  }
);
FlippableCard.displayName = "FlippableCard";

const NUM_PLACEHOLDER_CARDS = 12;
const PLACEHOLDER_KEYS = Array.from(
  { length: NUM_PLACEHOLDER_CARDS },
  (_, i) => `placeholder-${i}`
);

const CardList: React.FC<{
  sort: string;
  query: string;
}> = ({ sort, query }) => {
  const { buildings } = useBuildings();
  const { status: roomStatusData } = useStatus();
  const { userLat, userLng } = useUserLocation();

  let displayedBuildings: Building[] | undefined = buildings;

  // If we have all data, apply filters
  if (buildings && roomStatusData && Object.keys(roomStatusData).length !== 0) {
    // Filter any out that don't start with query
    // If hideUnavailable is true, filter any that have no available rooms
    displayedBuildings = buildings
      .filter(
        (building) =>
          building.name.toLowerCase().includes(query.toLowerCase()) &&
          Object.keys(roomStatusData[building.id].roomStatuses).length > 0
      )
      .sort((a, b) => {
        switch (sort) {
          case "lowerToUpper":
            return compareBuildingPosition(a, b, "lowerToUpper");
          case "upperToLower":
            return compareBuildingPosition(a, b, "upperToLower");
          case "nearest":
            return userLat && userLng
              ? calculateDistance(userLat, userLng, a.lat, a.long) -
                  calculateDistance(userLat, userLng, b.lat, b.long)
              : 0;
          case "mostRooms":
            return (
              getNumFreerooms(roomStatusData[b.id]) -
              getNumFreerooms(roomStatusData[a.id])
            );
          case "reverseAlphabetical":
            return b.name.localeCompare(a.name);
          default:
            // default is alphabetical
            return a.name.localeCompare(b.name);
        }
      });
  }

  const items: { key: string; buildingId?: string }[] = displayedBuildings
    ? displayedBuildings.map((b) => ({ key: b.id, buildingId: b.id }))
    : PLACEHOLDER_KEYS.map((key) => ({ key, buildingId: undefined }));

  return (
    <CardGrid>
      <AnimatePresence initial={false} mode="popLayout">
        {items.map(({ key, buildingId }) => (
          <motion.div
            key={key}
            layout="position"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              layout: {
                type: "tween",
                duration: 0.75,
                ease: "easeInOut",
              },
              opacity: {
                duration: 0.2,
                ease: "easeInOut",
              },
            }}
          >
            <FlippableCard buildingId={buildingId} />
          </motion.div>
        ))}
      </AnimatePresence>
    </CardGrid>
  );
};

export default CardList;
