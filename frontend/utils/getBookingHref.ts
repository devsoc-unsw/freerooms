const getBookingHref = (roomId: string, occurrenceId: string): string => {
  return `/booking/${encodeURIComponent(roomId)}/${encodeURIComponent(occurrenceId)}`;
};

export default getBookingHref;
