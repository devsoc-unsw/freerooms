import { Building } from "@common/types";
import { useMediaQuery } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import React from "react";
import FlipMove from "react-flip-move";

import BuildingCard from "../components/BuildingCard";
import BuildingCardMobile from "../components/BuildingCardMobile";
import LoadingCircle from "../components/LoadingCircle";
import useBuildings from "../hooks/useBuildings";
import useStatus from "../hooks/useStatus";
import useUserLocation from "../hooks/useUserLocation";
import calculateDistance from "../utils/calculateDistance";
import { getNumFreerooms } from "../utils/utils";
import CardListSkeleton from "@frontend/components/CardListSkeleton";

const FlipMoveGrid = styled(FlipMove)(({ theme }) => ({
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

const FlippableCard = React.forwardRef<HTMLDivElement, { buildingId: string }>(
  ({ buildingId }, ref) => {
    const displayMobile = useMediaQuery(useTheme().breakpoints.down("sm"));
    return (
      <div ref={ref}>
        {displayMobile ? (
          <BuildingCardMobile buildingId={buildingId} />
        ) : (
          <BuildingCard buildingId={buildingId} />
        )}
      </div>
    );
  }
);
FlippableCard.displayName = "FlippableCard";

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

  return displayedBuildings ? (
    <FlipMoveGrid duration={500}>
      {displayedBuildings.map((building) => (
        <FlippableCard key={building.id} buildingId={building.id} />
      ))}
    </FlipMoveGrid>
  ) : (
    <CardListSkeleton/>
  );
};

export default CardList;
