"use client";

import translateRoomUsage from "@common/roomUsages";
import getSchoolDetails from "@common/schools";
import type { Booking, Room } from "@common/types";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Dictionary } from "@reduxjs/toolkit";
import RoomRating from "components/Rating/RoomRating";
import RoomUtilityTags from "components/RoomUtilityTags";
import useRoomRatings from "hooks/useRoomRatings";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useState } from "react";

import BookingButton from "../../../components/BookingButton";
import BookingCalendar from "../../../components/BookingCalendar";
import FeedbackButton from "../../../components/FeedbackButton";
import LoadingCircle from "../../../components/LoadingCircle";
import RoomBackButton from "../../../components/RoomBackButton";
import useBookings from "../../../hooks/useBookings";
import useBuilding from "../../../hooks/useBuilding";
import useRoom from "../../../hooks/useRoom";
import room_photos from "../../../public/room-photos.json";

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

  return (
    <Container maxWidth="xl">
      <FeedbackButton />
      {room && building ? (
        <Stack
          justifyContent="center"
          alignItems="center"
          width="100%"
          py={5}
          height="100%"
          px={{ xs: 3, md: 15 }}
        >
          <RoomPageHeader room={room} buildingName={building.name} />
          <RoomImage
            src={
              roomParam in room_photos
                ? `${(room_photos as Dictionary<String>)[roomParam]}`
                : `/assets/building_photos/${campus}-${grid}.webp`
            }
          />
          <BookingCalendar events={adjustedBookings ?? []} roomID={room.id} />
          <RoomUtilityTags roomId={room?.id} />
          <RoomRating buildingID={building.id} roomID={room.id} />
        </Stack>
      ) : (
        <LoadingCircle />
      )}
    </Container>
  );
}

const RoomPageHeader: React.FC<{ room: Room; buildingName: string }> = ({
  room,
  buildingName,
}) => {
  const [openDialog, setDialog] = useState(false);
  const toggleDialog = () => {
    setDialog((isOpen) => {
      return !isOpen;
    });
  };

  const schoolDetails = getSchoolDetails(room.school);
  const dialogMessage = schoolDetails
    ? `This room is managed by ${schoolDetails.name}. Please contact the school to request a booking`
    : "This room is managed externally by its associated school. Please contact the school to request a booking";

  const ratings = useRoomRatings(room.id);
  let ratingValue = 0;

  if (ratings.ratings && ratings.ratings.length > 0) {
    ratings.ratings.forEach((rating) => {
      ratingValue += rating.overall;
    });
    ratingValue = ratingValue / ratings.ratings.length;
    ratingValue = Math.round(ratingValue * 10) / 10;
  }

  return (
    <Stack
      width="100%"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack direction="column" spacing={1} width="100%" mb={1}>
        <RoomBackButton />
        {buildingName != "" && (
          <Stack
            direction="row"
            spacing={2}
            divider={
              <Typography display="inline" variant="subtitle2">
                /
              </Typography>
            }
          >
            <Typography variant="subtitle2">{buildingName} </Typography>
            <Typography variant="subtitle2">
              {translateRoomUsage(room.usage)}
            </Typography>
            {room.school != " " && (
              <Typography fontWeight="bold" color="#e65100" variant="subtitle2">
                ID Required
              </Typography>
            )}
          </Stack>
        )}

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          width="100%"
        >
          <Typography variant="h4" fontWeight={550}>
            {room.name}
          </Typography>
          <BookingButton
            school={room.school}
            usage={room.usage}
            onClick={toggleDialog}
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Typography variant="body1" fontWeight="bold">
            ID: {room.id}
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            Capacity: {room.capacity}
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            Abbreviation: {room.abbr}
          </Typography>

          {room.school != " " && (
            <Typography variant="body1" fontWeight="bold">
              School:{" "}
              <Typography display="inline" variant="body1">
                {schoolDetails ? schoolDetails.name : room.school}
              </Typography>
            </Typography>
          )}
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.3}
          aria-label="5-star-info"
        >
          <Typography variant="body1" fontWeight="bold">
            {ratingValue == 0 ? 0 : ratingValue}
          </Typography>
          <Rating
            readOnly
            value={ratingValue}
            size="small"
            precision={0.5}
            sx={{ color: "rgb(255, 169, 12)" }}
          />
        </Stack>
      </Stack>
      <Dialog
        open={openDialog}
        onClose={toggleDialog}
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <DialogTitle>
          <Typography variant="h6" fontWeight="Bold">
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
            color: (theme) => theme.palette.grey[500],
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

const RoomImage: React.FC<{ src: string }> = ({ src }) => {
  return (
    <Box minWidth="100%" minHeight={300} position="relative">
      <Image
        src={src}
        alt="Room Image"
        fill
        style={{ objectFit: "cover", borderRadius: 10 }}
      />
    </Box>
  );
};
