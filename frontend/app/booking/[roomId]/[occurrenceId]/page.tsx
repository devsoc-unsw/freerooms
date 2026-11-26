"use client";

import BookingHeader from "@frontend/components/booking/BookingHeader";
import BookingTimeSummary from "@frontend/components/booking/BookingTimeSummary";
import RoomBackButton from "@frontend/components/navigation/RoomBackButton";
import RoomMetadata from "@frontend/components/rooms/RoomMetadata";
import useBookingDetails from "@frontend/hooks/bookings/useBookingDetails";
import useRelatedBookings from "@frontend/hooks/bookings/useRelatedBookings";
import useBuilding from "@frontend/hooks/buildings/useBuilding";
import useRoomRatings from "@frontend/hooks/ratings/useRoomRatings";
import useRoom from "@frontend/hooks/rooms/useRoom";
import { sizes, space } from "@frontend/theme";
import { getPlannedAttendance } from "@frontend/utils/bookingFormatting";
import { getBuildingIdFromRoomId } from "@frontend/utils/utils";
import { Button, Container, Skeleton, Stack, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import RoomPhotoCarousel from "@frontend/components/rooms/RoomPhotoCarousel";
import roomPhotos from "@frontend/public/room-photos.json";
import BookingRoomActions from "@frontend/components/booking/BookingRoomActions";

export default function BookingPage() {
  const { roomId, occurrenceId } = useParams<{
    roomId: string;
    occurrenceId: string;
  }>();

  const { booking, error, isLoading, notFound, mutate } = useBookingDetails(
    roomId,
    occurrenceId
  );

  const { room } = useRoom(roomId);

  const {data: ratings} = useRoomRatings(room?.id);

  const buildingId = getBuildingIdFromRoomId(roomId);
  const { building } = useBuilding(buildingId);

  const roomPhotosUrls = roomPhotos[roomId as keyof typeof roomPhotos];

  const photos = roomPhotosUrls && roomPhotosUrls.length > 0 ? roomPhotosUrls : [`/assets/building_photos/${buildingId}.webp`]

  const {
    relatedBookings,
    error: relatedBookingsError,
    isLoading: relatedBookingsLoading,
  } = useRelatedBookings(booking?.eventId);

  const otherBookings = relatedBookings?.filter(
    (relatedBooking) =>
      relatedBooking.roomId !== roomId ||
      relatedBooking.occurrenceId !== occurrenceId
  );

  const plannedAttendance = getPlannedAttendance(booking?.plannedSize);

  return (
    <Container maxWidth="xl">
      <Stack
        spacing={space.lg}
        sx={(theme) => ({
          width: "100%",
          paddingBlock: theme.space.xl,
          paddingInline: {
            xs: theme.space.md,
            md: theme.space.xxl,
          },
        })}
      >
        <RoomBackButton />

        {notFound ? (
          <Typography variant="h5">Booking not found</Typography>
        ) : error && !booking ? (
          <Stack spacing={2} sx={{ alignItems: "flex-start" }}>
            <Typography variant="h5">Failed to load booking</Typography>

            <Button onClick={() => void mutate()}>Retry</Button>
          </Stack>
        ) : isLoading || !booking ? (
          <BookingPageSkeleton />
        ) : (
          <>
            <Stack spacing={space.sm}>
                <BookingHeader
                booking={booking}
                roomName={room?.name}
                buildingName={building?.name}
                />

                {room && (
                    <RoomMetadata
                        room={room}
                        rating={ratings?.overallRating}
                    />
                )}

                <BookingTimeSummary booking={booking} />

                <Stack spacing={space.md}>
                    <RoomPhotoCarousel
                        photos={photos}
                        height={sizes.roomPhoto.bookingHeight}
                    />

                    {room && (
                        <BookingRoomActions
                            roomId={room.id}
                            buildingId={building?.id}
                        />
                    )}
                </Stack>
            </Stack>

            <Typography>
              Planned attendance:{" "}
              {plannedAttendance ?? "Not specified"}
              {plannedAttendance !== undefined && room && room.capacity > 0 ? ` / ${room.capacity}` : ""}
            </Typography>

            {booking.bookingModules.map((module, index) => (
              <Typography key={index}>
                {[module.code, module.name].filter(Boolean).join(" / ")}
              </Typography>
            ))}

            {relatedBookingsLoading ? (
              <Typography>Loading other sessions...</Typography>
            ) : relatedBookingsError ? (
              <Typography>Failed to load other sessions</Typography>
            ) : (
              <Typography>
                Other sessions: {otherBookings?.length ?? 0}{" "}
              </Typography>
            )}
          </>
        )}
      </Stack>
    </Container>
  );
}

const BookingPageSkeleton = () => (
  <Stack spacing={space.lg}>
    <Stack spacing={space.sm}>
      <Skeleton variant="rounded" width={90} height={24} />

      <Skeleton variant="text" width="60%" sx={{ fontSize: "h3.fontSize" }} />

      <Skeleton variant="text" width="40%" />
    </Stack>

    <Skeleton variant="rounded" height={140} />

    <Skeleton variant="rounded" height={200} />

    <Skeleton variant="text" width="50%" />
  </Stack>
);
