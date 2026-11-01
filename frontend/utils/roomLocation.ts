const FLOOR_LABELS: Record<string, string> = {
  B: "Basement Floor",
  LG: "Lower Ground Floor",
  G: "Ground Floor",
  M: "Mezzanine Floor",
}; // Todo: add additional floors like Level 1 etc.

// Trailing digits of a building id ("K-F17" -> 17): the number CardList sorts buildings by
export const getBuildingGridNumber = (buildingId: string): number => {
  const digits = buildingId.match(/(\d+)$/)?.[1];
  return digits === undefined ? Infinity : Number(digits);
};

export const getCampus = (buildingId: string): "lower" | "upper" =>
  getBuildingGridNumber(buildingId) < 19 ? "lower" : "upper";

export const getFloorLabel = (roomId: string): string | null => {
  const roomNumber = roomId.split("-")[2];
  const prefix = roomNumber?.match(/^([A-Za-z]+)/)?.[1]?.toUpperCase();
  return prefix ? (FLOOR_LABELS[prefix] ?? null) : null;
};