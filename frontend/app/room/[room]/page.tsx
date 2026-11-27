"use client";
import "swiper/css";
import "swiper/css/navigation";

import BookingButton from "@frontend/components/booking/BookingButton";
import BookingCalendar from "@frontend/components/booking/BookingCalendar";
import FeedbackButton from "@frontend/components/feedback/FeedbackButton";
import RoomBackButton from "@frontend/components/navigation/RoomBackButton";
import ViewOnMapButton from "@frontend/components/navigation/ViewOnMapButton";
import RoomRating from "@frontend/components/ratings/RoomRating";
import RoomMetadata from "@frontend/components/rooms/RoomMetadata";
import RoomPhotoCarousel from "@frontend/components/rooms/RoomPhotoCarousel";
import RoomUtilityTags from "@frontend/components/rooms/RoomUtilityTags";
import PageContainer from "@frontend/components/ui/PageContainer";
import useBookings from "@frontend/hooks/bookings/useBookings";
import useBuilding from "@frontend/hooks/buildings/useBuilding";
import useRoomRatings from "@frontend/hooks/ratings/useRoomRatings";
import useFavourites from "@frontend/hooks/rooms/useFavourites";
import useRoom from "@frontend/hooks/rooms/useRoom";
import room_photos from "@frontend/public/room-photos.json";
import { space } from "@frontend/theme";
import { getBuildingIdFromRoomId } from "@frontend/utils/utils";
import CloseIcon from "@mui/icons-material/Close";
import FavouriteIcon from "@mui/icons-material/Favorite";
import FavouriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Skeleton,
} from "@mui/material";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import getSchoolDetails from "common/schools";
import type { Booking, Room } from "common/types";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const adjustDateIfMidnight = (inputDate: Date): Date => {
  // Check if the time is midnight (00:00:00)
  if (
    inputDate.getHours() === 0 &&
    inputDate.getMinutes() === 0 &&
    inputDate.getSeconds() === 0
  ) {
    // Set the time to 11:59:00 and subtract one day
    const adjusted = new Date(inputDate);
    adjusted.setHours(23, 59);
    adjusted.setDate(inputDate.getDate() - 1);
    return adjusted;
  } else {
    return inputDate;
  }
};

export default function Page() {
  const params = useParams();
  const roomParam = params.room as string;
  const { bookings } = useBookings(roomParam);
  const adjustedBookings: Booking[] | undefined = bookings?.map((booking) => ({
    ...booking,
    end: adjustDateIfMidnight(booking.end),
  }));

  const { room } = useRoom(roomParam);
  const [campus, grid] = room ? room.id.split("-") : ["", ""];
  const { building } = useBuilding(`${campus}-${grid}`);
  const { isFavourite, toggleFavourite } = useFavourites();

  const roomPhotoUrls = room_photos[roomParam as keyof typeof room_photos];
  const photos =
    roomPhotoUrls && roomPhotoUrls.length > 0
      ? roomPhotoUrls
      : [`/assets/building_photos/${campus}-${grid}.webp`];

  return (
    <PageContainer maxWidth="xl">
      <FeedbackButton />
      <Stack
        spacing={space.lg}
        sx={(theme) => ({
          width: "100%",
          minWidth: 0,
          paddingBlock: theme.space.xl,
        })}
      >
        <RoomPageHeader
          room={room}
          favourite={room ? isFavourite(room.id) : false}
          onToggleFavourite={() => {
            if (room) toggleFavourite(room.id);
          }}
        />
        <RoomPhotoCarousel photos={photos} loading={!room} />
        <BookingCalendar events={adjustedBookings ?? []} loading={!room} />
        <RoomUtilityTags roomId={room?.id} />
        <RoomRating
          buildingID={building?.id ?? ""}
          roomID={room?.id ?? ""}
          loading={!room || !building}
        />
      </Stack>
    </PageContainer>
  );
}

const RoomPageHeaderSkeleton = () => (
  <Stack spacing={space.md} sx={{ width: "100%" }}>
    <Skeleton animation="wave" variant="rounded" width={80} height={36} />

    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Skeleton
        animation="wave"
        variant="text"
        width="60%"
        sx={{ fontSize: "h3.fontSize" }}
      />

      <Skeleton animation="wave" variant="circular" width={40} height={40} />
    </Stack>

    <Stack direction="row" useFlexGap flexWrap="wrap" spacing={space.md}>
      {Array.from({ length: 6 }, (_, index) => (
        <Skeleton key={index} animation="wave" variant="text" width={100} />
      ))}
    </Stack>
  </Stack>
);

const RoomPageHeader: React.FC<{
  room?: Room;
  favourite: boolean;
  onToggleFavourite: () => void;
}> = ({ room, favourite, onToggleFavourite }) => {
  const [openDialog, setDialog] = useState(false);

  const toggleDialog = () => {
    setDialog((isOpen) => !isOpen);
  };

  const ratings = useRoomRatings(room?.id);

  if (!room) {
    return <RoomPageHeaderSkeleton />;
  }

  const schoolDetails = getSchoolDetails(room.school);
  const dialogMessage = schoolDetails
    ? `This room is managed by ${schoolDetails.name}. Please contact the school to request a booking`
    : "This room is managed externally by its associated school. Please contact the school to request a booking";

  const buildingId = getBuildingIdFromRoomId(room.id);

  return (
    <Stack spacing={space.md} sx={{ width: "100%" }}>
      <RoomBackButton />

      <Stack spacing={space.sm}>
        <Stack
          direction="row"
          spacing={space.md}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            sx={{ overflowWrap: "anywhere" }}
          >
            {room.name}
          </Typography>

          <IconButton
            onClick={onToggleFavourite}
            aria-label={favourite ? "Remove as favourite" : "Add as favourite"}
            aria-pressed={favourite}
            color="primary"
            sx={{ flexShrink: 0 }}
          >
            {favourite ? <FavouriteIcon /> : <FavouriteBorderIcon />}
          </IconButton>
        </Stack>

        <RoomMetadata room={room} rating={ratings.data?.overallRating} />
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={space.sm}>
        <ViewOnMapButton buildingId={buildingId} />

        <BookingButton
          school={room.school}
          usage={room.usage}
          onClick={toggleDialog}
        />
      </Stack>

      <Dialog
        open={openDialog}
        onClose={toggleDialog}
        slotProps={{
          paper: { sx: { borderRadius: "10px" } },
        }}
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Booking this Room
          </Typography>
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={() => setDialog(false)}
          sx={{
            position: "absolute",
            right: 12,
            top: 12,
            color: (theme) => theme.colours.text.secondary,
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent dividers>
          <DialogContentText>
            <Stack direction="column" spacing={2}>
              <Typography variant="body1">{dialogMessage}</Typography>
              {schoolDetails && (
                <Typography variant="body1">
                  You can find the contact details of the school{" "}
                  <Link target="_blank" href={schoolDetails.contactLink}>
                    here
                  </Link>
                  .
                </Typography>
              )}
            </Stack>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </Stack>
  );
};
