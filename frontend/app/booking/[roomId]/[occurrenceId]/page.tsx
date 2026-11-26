"use client";

import BookingAttendance from "@frontend/components/booking/BookingAttendance";
import BookingHeader from "@frontend/components/booking/BookingHeader";
import BookingModuleDetails from "@frontend/components/booking/BookingModuleDetails";
import BookingRoomActions from "@frontend/components/booking/BookingRoomActions";
import BookingTimeSummary from "@frontend/components/booking/BookingTimeSummary";
import RelatedBookings from "@frontend/components/booking/RelatedBookings";
import RoomBackButton from "@frontend/components/navigation/RoomBackButton";
import RoomMetadata from "@frontend/components/rooms/RoomMetadata";
import RoomPhotoCarousel from "@frontend/components/rooms/RoomPhotoCarousel";
import useBookingDetails from "@frontend/hooks/bookings/useBookingDetails";
import useRelatedBookings from "@frontend/hooks/bookings/useRelatedBookings";
import useBuilding from "@frontend/hooks/buildings/useBuilding";
import useRoomRatings from "@frontend/hooks/ratings/useRoomRatings";
import useRooms from "@frontend/hooks/rooms/useRooms";
import roomPhotos from "@frontend/public/room-photos.json";
import { sizes, space } from "@frontend/theme";
import getBookingHref from "@frontend/utils/getBookingHref";
import { getBuildingIdFromRoomId } from "@frontend/utils/utils";
import { Button, Container, Skeleton, Stack, Typography } from "@mui/material";
import { useParams } from "next/navigation";

export default function BookingPage() {
  const { roomId, occurrenceId } = useParams<{
    roomId: string;
    occurrenceId: string;
  }>();

  const { booking, error, isLoading, notFound, mutate } = useBookingDetails(
    roomId,
    occurrenceId
  );

  const { rooms } = useRooms();
  const room = rooms?.[roomId];

  const { data: ratings } = useRoomRatings(room?.id);

  const buildingId = getBuildingIdFromRoomId(roomId);
  const { building } = useBuilding(buildingId);

  const roomPhotosUrls = roomPhotos[roomId as keyof typeof roomPhotos];

  const photos =
    roomPhotosUrls && roomPhotosUrls.length > 0
      ? roomPhotosUrls
      : [`/assets/building_photos/${buildingId}.webp`];

  const {
    relatedBookings,
    error: relatedBookingsError,
    isLoading: relatedBookingsLoading,
    mutate: retryRelatedBookings,
  } = useRelatedBookings(booking?.eventId);

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
        <RoomBackButton fallbackHref="/bookings" />

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
                <RoomMetadata room={room} rating={ratings?.overallRating} />
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

            <BookingAttendance
              plannedSize={booking.plannedSize}
              capacity={room?.capacity}
            />

            <BookingModuleDetails modules={booking.bookingModules} />

            {booking.eventId && (
              <>
                {relatedBookingsLoading && !relatedBookings ? (
                  <Skeleton variant="rounded" height={120} />
                ) : relatedBookingsError && !relatedBookings ? (
                  <Stack spacing={space.sm} sx={{ alignItems: "flex-start" }}>
                    <Typography color="text.secondary">
                      Failed to load related sessions
                    </Typography>

                    <Button onClick={() => void retryRelatedBookings()}>
                      Retry
                    </Button>
                  </Stack>
                ) : relatedBookings ? (
                  <RelatedBookings
                    key={getBookingHref(roomId, occurrenceId)}
                    booking={booking}
                    bookings={relatedBookings}
                    rooms={rooms}
                  />
                ) : null}
              </>
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

    <Skeleton variant="rounded" height={sizes.roomPhoto.bookingHeight} />

    <Skeleton variant="text" width="50%" />
  </Stack>
);
