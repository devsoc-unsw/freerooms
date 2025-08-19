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

const FlipMoveGrid = styled(FlipMove)(() => ({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gridGap: "20px",
}));

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

  const displayMobile = useMediaQuery(useTheme().breakpoints.down("sm"));

  // This exists so that while new filtered data is loading, the old one stays there
  const [persistedData, setPersistedData] = React.useState(roomStatusData);
  React.useEffect(() => {
    if (roomStatusData) {
      setPersistedData(roomStatusData);
    }
  }, [roomStatusData]);

  let displayedBuildings: Building[] | undefined = buildings;

  // If we have all data, apply filters
  if (buildings && persistedData && Object.keys(persistedData).length != 0) {
    // Filter any out that don't start with query
    // If hideUnavailable is true, filter any that have no available rooms
    displayedBuildings = buildings
      .filter(
        (building) =>
          building.name.toLowerCase().includes(query.toLowerCase()) &&
          Object.keys(persistedData[building.id]).length > 0
      )
      .sort((a, b) => {
        switch (sort) {
          case "lowerToUpper":
            return a.long - b.long;
          case "upperToLower":
            return b.long - a.long;
          case "nearest":
            return userLat && userLng
              ? calculateDistance(userLat, userLng, a.lat, a.long) -
                  calculateDistance(userLat, userLng, b.lat, b.long)
              : 0;
          case "mostRooms":
            return (
              getNumFreerooms(persistedData[b.id]) -
              getNumFreerooms(persistedData[a.id])
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
    <LoadingCircle />
  );
};

export default CardList;
