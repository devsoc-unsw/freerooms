import { styled } from "@mui/material/styles";
import React from "react";
import FlipMove from "react-flip-move";

import BuildingCard from "../components/BuildingCard";
import { getNumFreerooms } from "../utils/utils";
import useStatus from "../hooks/useStatus";
import { Building, RoomsReturnData } from "../types";

const INITIALISING = -2;
const FAILED = -1;

const FlipMoveGrid = styled(FlipMove)(() => ({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gridGap: "20px",
}));

const FlippableCard = React.forwardRef<HTMLDivElement, {
  building: Building;
  setBuilding: (bldg: Building) => void;
  freerooms: number;
}>(({ building, setBuilding, freerooms }, ref) => (
  <div ref={ref}>
    <BuildingCard
      building={building}
      setBuilding={setBuilding}
      freerooms={freerooms}
    />
  </div>
));
FlippableCard.displayName = "FlippableCard";

const CardList: React.FC<{
  buildings: Building[];
  setCurrentBuilding: (building: Building) => void;
  sort: string;
  query: string;
}> = ({ buildings, setCurrentBuilding, sort, query }) => {
  const [displayedBuildings, setDisplayedBuildings] = React.useState(buildings);
  const { status: roomStatusData } = useStatus();

  React.useEffect(() => {
    if (roomStatusData === undefined || Object.keys(roomStatusData).length == 0)
      return;

    // Filter any out that dont start with query
    // If hideUnavailable is true, filter any that have no available rooms
    const newDisplayedBuildings = buildings.filter((building) =>
      building.name.toLowerCase().includes(query.toLowerCase()) &&
      Object.keys(roomStatusData[building.id]).length > 0,
    );

    // Sort the displayed buildings
    newDisplayedBuildings.sort((a, b) => {
      switch (sort) {
        case "lowerToUpper":
          return a.long - b.long;
        case "upperToLower":
          return b.long - a.long;
        case "nearest":
        // idk lol
        case "mostRooms":
          return (
            getNumFreerooms(roomStatusData, b.id) -
            getNumFreerooms(roomStatusData, a.id)
          );
        case "reverseAlphabetical":
          return b.name.localeCompare(a.name);
        default:
          // default is alphabetical
          return a.name.localeCompare(b.name);
      }
    });

    setDisplayedBuildings(newDisplayedBuildings);
  }, [query, sort, roomStatusData, buildings]);

  return (
    <FlipMoveGrid duration={500}>
      {displayedBuildings.map((building) => (
        <FlippableCard
          key={building.id}
          building={building}
          setBuilding={setCurrentBuilding}
          freerooms={getNumFreerooms(roomStatusData, building.id)}
        />
      ))}
    </FlipMoveGrid>
  );
};

export default CardList;
