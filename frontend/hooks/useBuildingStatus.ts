/**
 * Data fetching hook for status of specific building
 * Uses datetime and filters from Redux store
 */
import useStatus from "./useStatus";

const useBuildingStatus = (buildingId?: string) => {
  const { status, error } = useStatus();

  // No id yet (e.g. a loading placeholder card)
  if (!buildingId) {
    return { status: undefined, error };
  }

  // Error occurred while fetching all buildings
  if (error) {
    return { status: undefined, error };
  }

  // Still loading
  if (!status) {
    return { status: undefined, error };
  }

  // Try find building
  const buildingStatus = status[buildingId];
  if (!buildingStatus) {
    return {
      status: undefined,
      error: new Error("No status data for " + buildingId),
    };
  }

  return { status: buildingStatus, error };
};

export default useBuildingStatus;
