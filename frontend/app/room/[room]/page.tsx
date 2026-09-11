"use client";
import "swiper/css";
import "swiper/css/navigation";

import translateRoomUsage from "@common/roomUsages";
import getSchoolDetails from "@common/schools";
import type { Booking, Room } from "@common/types";
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
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import RoomRating from "@frontend/components/ratings/RoomRating";
import RoomUtilityTags from "@frontend/components/rooms/RoomUtilityTags";
import useRoomRatings from "@frontend/hooks/useRoomRatings";
import { useParams } from "next/navigation";
import React, { useState } from "react";

import BookingButton from "@frontend/components/booking/BookingButton";
import BookingCalendar from "@frontend/components/booking/BookingCalendar";
import FeedbackButton from "@frontend/components/feedback/FeedbackButton";
import RoomBackButton from "@frontend/components/navigation/RoomBackButton";
import RoomPhotoCarousel from "@frontend/components/rooms/RoomPhotoCarousel";
import ViewOnMapButton from "@frontend/components/navigation/ViewOnMapButton";
import useBookings from "@frontend/hooks/useBookings";
import useBuilding from "@frontend/hooks/useBuilding";
import useFavourites from "@frontend/hooks/useFavourites";
import useRoom from "@frontend/hooks/useRoom";
import room_photos from "@frontend/public/room-photos.json";
import { getBuildingIdFromRoomId } from "@frontend/utils/utils";

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
    <Container maxWidth="xl">
      <FeedbackButton />
      <Stack
        sx={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          paddingTop: 5,
          paddingBottom: 5,
          height: "100%",
          paddingLeft: { xs: 3, md: 15 },
          paddingRight: { xs: 3, md: 15 },
        }}
      >
        <RoomPageHeader
          room={room}
          buildingName={building?.name ?? ""}
          favourite={room ? isFavourite(room.id) : false}
          onToggleFavourite={() => {
            if (room) toggleFavourite(room.id);
          }}
        />
        <RoomPhotoCarousel photos={photos} loading={!room} />
        <BookingCalendar
          events={adjustedBookings ?? []}
          roomID={room?.id ?? ""}
          loading={!room}
        />
        <RoomUtilityTags roomId={room?.id} />
        <RoomRating
          buildingID={building?.id ?? ""}
          roomID={room?.id ?? ""}
          loading={!room || !building}
        />
      </Stack>
    </Container>
  );
}

const RoomPageHeaderSkeleton = () => (
  <Stack
    direction="row"
    sx={{
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Stack
      direction="column"
      spacing={1}
      sx={{ width: "100%", marginBottom: 1 }}
    >
      {/* RoomBackButton */}
      <Skeleton animation="wave" variant="rounded" width={80} height={36} />

      {/* building / usage breadcrumb */}
      <Stack direction="row" spacing={2}>
        <Skeleton
          animation="wave"
          variant="text"
          width={140}
          sx={{ fontSize: 14 }}
        />
        <Skeleton
          animation="wave"
          variant="text"
          width={90}
          sx={{ fontSize: 14 }}
        />
        <Skeleton
          animation="wave"
          variant="text"
          width={90}
          sx={{ fontSize: 14 }}
        />
      </Stack>

      {/* title, ViewOnMap, Booking buttons */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "start" },
          width: "100%",
        }}
      >
        <Skeleton animation="wave" variant="rounded" width="40%" height={45} />

        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", mt: { xs: 1, sm: 0 } }}
        >
          {/* favourite icon button */}
          <Skeleton
            animation="wave"
            variant="circular"
            width={40}
            height={40}
            sx={{ flexShrink: 0 }}
          />
          <Skeleton
            animation="wave"
            variant="rounded"
            height={45}
            sx={{ width: { xs: "100%", sm: "160px" } }}
          />
          <Skeleton
            animation="wave"
            variant="rounded"
            height={45}
            sx={{ width: { xs: "100%", sm: "160px" } }}
          />
        </Stack>
      </Stack>

      {/* ID, capacity, abbreviation row */}
      <Stack direction="row" spacing={2}>
        <Skeleton
          animation="wave"
          variant="text"
          width={150}
          sx={{ fontSize: 16 }}
        />
        <Skeleton
          animation="wave"
          variant="text"
          width={150}
          sx={{ fontSize: 16 }}
        />
        <Skeleton
          animation="wave"
          variant="text"
          width={150}
          sx={{ fontSize: 16 }}
        />
      </Stack>

      {/* rating row */}
      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
        <Skeleton
          animation="wave"
          variant="text"
          width={16}
          sx={{ fontSize: 16 }}
        />
        <Skeleton animation="wave" variant="rounded" width={110} height={20} />
      </Stack>
    </Stack>
  </Stack>
);

const RoomPageHeader: React.FC<{
  room?: Room;
  buildingName: string;
  favourite: boolean;
  onToggleFavourite: () => void;
}> = ({ room, buildingName, favourite, onToggleFavourite }) => {
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
  const ratingValue = (() => {
    // round rating to nearest .5 if a rating exists
    if (!ratings || !ratings.data) return 0;
    const rating = ratings.data.overallRating;
    const frac = rating % 1;
    return frac >= 0.3 && frac <= 0.7
      ? Math.floor(rating) + 0.5
      : Math.round(rating);
  })();

  return (
    <Stack
      direction="row"
      sx={{
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Stack
        direction="column"
        spacing={1}
        sx={{
          width: "100%",
          marginBottom: 1,
        }}
      >
        <RoomBackButton />

        {buildingName !== "" && (
          <Stack
            direction="row"
            spacing={2}
            divider={
              <Typography variant="subtitle2" sx={{ display: "inline" }}>
                /
              </Typography>
            }
          >
            <Typography variant="subtitle2">{buildingName}</Typography>
            <Typography variant="subtitle2">
              {translateRoomUsage(room.usage)}
            </Typography>
            {room.school !== " " && (
              <Typography
                variant="subtitle2"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                ID Required
              </Typography>
            )}
          </Stack>
        )}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "start" },
            width: "100%",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 550 }}>
            {room.name}
          </Typography>

          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
            }}
          >
            <IconButton
              onClick={onToggleFavourite}
              aria-label={
                favourite ? "Remove as favourite" : "Add as favourite"
              }
            >
              {favourite ? (
                <FavouriteIcon color="primary" />
              ) : (
                <FavouriteBorderIcon />
              )}
            </IconButton>

            <ViewOnMapButton buildingId={buildingId} />

            <BookingButton
              school={room.school}
              usage={room.usage}
              onClick={toggleDialog}
            />
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            ID: {room.id}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Capacity: {room.capacity}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Abbreviation: {room.abbr}
          </Typography>

          {room.school !== " " && (
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>
              School:{" "}
              <Typography variant="body1" sx={{ display: "inline" }}>
                {schoolDetails ? schoolDetails.name : room.school}
              </Typography>
            </Typography>
          )}
        </Stack>

        <Stack
          direction="row"
          spacing={0.3}
          aria-label="5-star-info"
          sx={{ alignItems: "center" }}
        >
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            {ratingValue === 0 ? 0 : ratingValue}
          </Typography>
          <Rating
            readOnly
            value={ratingValue}
            size="small"
            precision={0.5}
            sx={{ color: (theme) => theme.colours.rating.active }}
          />
        </Stack>
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
