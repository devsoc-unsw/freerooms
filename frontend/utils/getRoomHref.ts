import { isValidDate } from "./queryValidation";

const getRoomHref = (roomId: string, date?: string): string => {
  if (!date || !isValidDate(date)) {
    return `/room/${roomId}`;
  }

  return `/room/${roomId}?date=${date}`;
};

export default getRoomHref;
