// The time a room's status runs until for the day, or null
export const getStatusEnd = (roomStatus: { endtime: string }): Date | null => {
  const end = new Date(roomStatus.endtime);
  return Number.isNaN(end.getTime()) ? null : end;
};

// Room Cards display free or busy, and 'soon' is also treated as busy
export const getCardStatus = (roomStatus: {
  status: "free" | "busy" | "soon";
}): "free" | "busy" => (roomStatus.status === "free" ? "free" : "busy");
