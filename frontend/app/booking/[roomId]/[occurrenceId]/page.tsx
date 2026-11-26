"use client";

import RoomBackButton from "@frontend/components/navigation/RoomBackButton";
import useBookingDetails from "@frontend/hooks/bookings/useBookingDetails";
import useRelatedBookings from "@frontend/hooks/bookings/useRelatedBookings";
import useBuilding from "@frontend/hooks/buildings/useBuilding";
import useRoom from "@frontend/hooks/rooms/useRoom";
import { getBuildingIdFromRoomId } from "@frontend/utils/utils";
import { Button, Container, Skeleton, Stack, Typography } from "@mui/material";
import { useParams } from "next/navigation";

export default function BookingPage() {
    const {roomId, occurrenceId} = useParams<{
        roomId: string,
        occurrenceId: string,
    }>();

    const {
        booking,
        error,
        isLoading,
        notFound,
        mutate,
    } = useBookingDetails(roomId, occurrenceId);

    const { room } = useRoom(roomId);

    const buildingId = getBuildingIdFromRoomId(roomId);
    const { building } = useBuilding(buildingId);

    const {
        relatedBookings,
        error: relatedBookingsError,
        isLoading: relatedBookingsLoading,
    } = useRelatedBookings(booking?.eventId);

    const otherBookings  = relatedBookings?.filter(
        (relatedBooking) =>
            relatedBooking.roomId !== roomId ||
            relatedBooking.occurrenceId !== occurrenceId
    );

    return (
        <Container maxWidth="xl">
            <Stack
                spacing={3}
                sx={{
                    width: "100%",
                    paddingTop: 5,
                    paddingBottom: 5,
                    paddingLeft: { xs: 3, md: 15},
                    paddingRight: {xs: 3, md: 15},
                }}
            >
                <RoomBackButton />

                {notFound ? (
                    <Typography variant="h5">
                        Booking not found
                    </Typography>
                ) : error && !booking ? (
                    <Stack spacing={2} sx={{alignItems:"flex-start"}}>
                        <Typography variant="h5">
                            Failed to load booking
                        </Typography>

                        <Button onClick={() => void mutate()}>
                            Retry
                        </Button>
                    </Stack>
                ) : isLoading || !booking ? (
                    <BookingPageSkeleton />
                ) : (
                    <>
                        <Typography variant="h4">
                            {booking.name}
                        </Typography>

                        <Typography>
                            {booking.bookingType}
                        </Typography>

                        <Typography>
                            {building?.name && building.name !== room?.name
                                ? `${building.name} / ${room?.name ?? roomId}`
                                : room?.name ?? roomId
                            }
                        </Typography>

                        <Typography>
                            {booking.start.toLocaleString("en-AU", {
                                timeZone: "Australia/Sydney"
                            })}
                            {" to "}
                            {booking.end.toLocaleString("en-AU", {
                                timeZone: "Australia/Sydney"
                            })}
                        </Typography>

                        <Typography>
                            Planned attendance:{" "}
                            {booking.plannedSize ?? "Not specified"}
                            {room ? ` / ${room.capacity}` : ""}
                        </Typography>

                        {booking.bookingModules.map((module, index) => (
                            <Typography key={index}>
                                {[module.code, module.name]
                                    .filter(Boolean)
                                    .join(" / ")
                                }
                            </Typography>
                        ))}

                        {relatedBookingsLoading ? (
                            <Typography>Loading other sessions...</Typography>
                        ): relatedBookingsError ? (
                            <Typography>Failed to load other sessions</Typography>
                        ) : (
                            <Typography>Other sessions: {otherBookings?.length ?? 0} </Typography>
                        )}
                    </>
                )}
            </Stack>
        </Container>
    )
}

const BookingPageSkeleton = () => (
    <Stack spacing={2}>
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="rounded" height={120} />
        <Skeleton variant="rounded" height={200} />
        <Skeleton variant="text" width="50%" />
    </Stack>
)