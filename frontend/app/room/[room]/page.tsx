"use client" 

import Container from "@mui/material/Container";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';

import BookingCalendar from "../../../components/BookingCalendar";
import LoadingCircle from "../../../components/LoadingCircle";
import useBookings from "../../../hooks/useBookings";
import useRoom from "../../../hooks/useRoom";


type Event = {
	title: string;
	start: Date,
	end: Date,
}

export default function Page({ params }: {
  params: {room: string};
}) {
	const { bookings, error: bookingsError } = useBookings(params.room);
	const { room, error: roomError } = useRoom(params.room);
	const [ events, setEvents ] = React.useState<Array<Event>>([]);

	React.useEffect( () => {
		if (bookings) {
			setEvents(bookings.map(({ name, start, end }) => ({
				title: name,
				start,
				end
			})));
		} else if (bookingsError) {
			setEvents([]);
		}
	}, [bookings, bookingsError]);

  return (
    
    <Container maxWidth={false} sx={{ height: "100%" }}>
      { roomError || !room
				? <LoadingCircle/>
				: (
        <Stack justifyContent="center" alignItems="center" width="100%" py={5} height="100%">
	        <Typography variant='h4' fontWeight={550}>
	          {room.name}
	        </Typography>
					<BookingCalendar events={events} />
      </Stack>
      )}
    </Container>
    
  );
}
