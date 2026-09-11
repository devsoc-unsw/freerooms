/**
 * Data fetching hook for data of specified building
 */
import useBuildings from "./useBuildings";

const useBuilding = (buildingId?: string) => {
  const { buildings, error } = useBuildings();

  // No id yet (e.g. a loading placeholder card)
  if (!buildingId) {
    return { building: undefined, error };
  }

  // Error occurred while fetching all buildings
  if (error) {
    return { building: undefined, error };
  }

  // Still loading
  if (!buildings) {
    return { building: undefined, error };
  }

  // Try find building
  const building = buildings.find((b) => b.id === buildingId);
  if (!building) {
    return {
      building: undefined,
      error: new Error("No data for " + buildingId),
    };
  }

  return { building, error };
};

export default useBuilding;
