// The time a room's status runs until for the day, or null
export const getStatusEnd = (roomStatus: { endtime: string }): Date | null => {
  const end = new Date(roomStatus.endtime);
  return Number.isNaN(end.getTime()) ? null : end;
};
