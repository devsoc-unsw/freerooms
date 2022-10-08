
import React from "react";
import {Building, BuildingReturnData, BuildingStatus, RoomsReturnData } from "../types";

import BuildingCard from "../components/BuildingCard";

function lowerToUpper(a: any, b: any) {
  const a_ycoord = Number(a.id.slice(3, 5).replace(/'/g, ''));
  const b_ycoord = Number(b.id.slice(3, 5).replace(/'/g, ''));
  // const a_xcoord = (a.id.slice(2, 3));
  // const b_xcoord = (b.id.slice(2, 3));
  if (a_ycoord < b_ycoord) {
    return -1;
  }
  if (a_ycoord > b_ycoord) {
    return 1;
  }
  return 0;
}

const CardList: React.FC<{
  data: BuildingReturnData;
  setBuilding: (building: Building) => void;
  sortOrder: string;
  searchQuery: string;
  hideUnavailable: boolean;
  statusData: RoomsReturnData | undefined;
}> = ({ data, setBuilding, sortOrder, searchQuery, hideUnavailable, statusData }) => {
  const [buildings, setBuildings] = React.useState<Building[]>([...data.buildings]);

  React.useEffect(() => {
    // Filter any out that dont start with query
    // If hideUnavailable is true, filter any that have no available rooms
    const displayedBuildings = [...data.buildings].filter((building) => 
        building.name.toLowerCase().startsWith(searchQuery.toLowerCase()) &&
        (!hideUnavailable || countFreerooms(statusData, building.id))
    );
    
    // Sort the displayed buildings
    switch (sortOrder) {
      case "alphabetical":
        displayedBuildings.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "reverseAlphabetical":
        displayedBuildings.sort((a, b) => b.name.localeCompare(a.name)); break;
      case "lowerToUpper":
        displayedBuildings.sort(lowerToUpper); break;
      case "upperToLower":
        displayedBuildings.sort(lowerToUpper).reverse(); break;
      case "mostRooms":
        displayedBuildings.sort((a, b) =>
          countFreerooms(statusData, b.id) - countFreerooms(statusData, a.id)
        );
        break;
      case "nearest":
        // idk lol
    }
  
    setBuildings(displayedBuildings);
  }, [searchQuery, hideUnavailable, sortOrder, statusData]);

  return (
    <div
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gridGap: "20px",
      }}
    >
      {buildings.map((building) => (
        <BuildingCard
          building={building}
          key={building.id}
          setBuilding={setBuilding}
          freerooms={countFreerooms(statusData, building.id)}
        />
      ))}
    </div>
  );
}

const countFreerooms = (
  roomStatus: RoomsReturnData | undefined,
  buildingId: string
): number => {
  if (roomStatus === undefined) return -2;
  if (!(buildingId in roomStatus)) return -1;

  let freerooms = 0;
  for (const room of Object.values(roomStatus[buildingId])) {
    if (room.status === "free") freerooms++;
  }
  return freerooms;
}

export default CardList;