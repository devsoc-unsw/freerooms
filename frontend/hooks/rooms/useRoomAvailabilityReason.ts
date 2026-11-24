import useNearbyBookings from "@frontend/hooks/bookings/useNearbyBookings";
import { getStatusEnd } from "@frontend/utils/availability";
import type { RoomStatus } from "common/types";

// Used in the availability pill as the reason for unavailability
const useRoomAvailabilityReason = (
  roomId: string | undefined,
  status: RoomStatus | undefined
) => {
  const needsBookings =
    status !== undefined &&
    (status.status === "busy" ||
      (status.status === "free" && !getStatusEnd(status)));
  const { current, nextLaterThatDay } = useNearbyBookings(
    roomId,
    needsBookings
  );

  return { reason: current?.name, until: nextLaterThatDay?.start };
};

export default useRoomAvailabilityReason;