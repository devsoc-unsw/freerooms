"use client";

import translateRoomUsage from "@common/roomUsages";
import getSchoolDetails from "@common/schools";
import type { Booking, Room } from "@common/types";
import { ArrowBack } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import React, { useState } from "react";

import BookingButton from "../../../components/BookingButton";
import BookingCalendar from "../../../components/BookingCalendar";
import LoadingCircle from "../../../components/LoadingCircle";
import useBookings from "../../../hooks/useBookings";
import useBuilding from "../../../hooks/useBuilding";
import useRoom from "../../../hooks/useRoom";

import BuildingDrawer from "../../../views/BuildingDrawer";
import {
  selectCurrentBuilding,
  setCurrentBuilding,
} from "../../../redux/currentBuildingSlice";
import { useSelector } from "../../../redux/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

const BackButtonIcon = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentBuilding = useSelector(selectCurrentBuilding);
  const path = usePathname();

  const handleBackButton = () => {
    router.back();
    dispatch(setCurrentBuilding(currentBuilding));
  };

  const drawerOpen = !!currentBuilding && (path == "/browse" || path == "/map");
  return (
    <>
      <IconButton
        onClick={handleBackButton}
        style={{ width: "5%", color: "black" }}
      >
        <ArrowBack />
        <Typography variant="body1">Back</Typography>
      </IconButton>
      <BuildingDrawer open={drawerOpen} />
    </>
  );
};

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

export default function Page({ params }: { params: { room: string } }) {
  const { bookings } = useBookings(params.room);
  const adjustedBookings: Booking[] | undefined = bookings?.map((booking) => ({
    ...booking,
    end: adjustDateIfMidnight(booking.end),
  }));

  const { room } = useRoom(params.room);
  const [campus, grid] = room ? room.id.split("-") : ["", ""];
  const { building } = useBuilding(`${campus}-${grid}`);

  return (
    <Container maxWidth="xl">
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
          <RoomImage src={`/assets/building_photos/${campus}-${grid}.webp`} />
          <BookingCalendar events={adjustedBookings ?? []} />
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

  return (
    <Stack
      width="100%"
      direction="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Stack direction="column" spacing={1} width="100%" mb={1}>
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

        <IconButton href="/browse" style={{ width: "5%", color: "black" }}>
          <ArrowBack />
          <Typography variant="body1">Back</Typography>
        </IconButton>
        <BackButtonIcon />
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
