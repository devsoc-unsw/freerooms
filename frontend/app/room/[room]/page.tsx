"use client" 

import Container from "@mui/material/Container";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';

import BookingCalendar from "../../../components/BookingCalendar";
import LoadingCircle from "../../../components/LoadingCircle";
import useBookings from "../../../hooks/useBookings";
import useRoom from "../../../hooks/useRoom";

export default function Page({ params }: {
  params: {room: string};
}) {
	const { bookings } = useBookings(params.room);
	const { room } = useRoom(params.room);

  return (
    
    <Container maxWidth={false} sx={{ height: "100%" }}>
      { !room
				? <LoadingCircle/>
				: (
        <Stack justifyContent="center" alignItems="center" width="100%" py={5} height="100%">
	        <Typography variant='h4' fontWeight={550}>
	          {room.name}
	        </Typography>
					<BookingCalendar events={bookings ?? []} />
      </Stack>
      )}
    </Container>
    
  );
}
