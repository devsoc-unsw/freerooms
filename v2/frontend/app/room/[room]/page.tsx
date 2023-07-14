"use client" 

import Container from "@mui/material/Container";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';

import BookingCalendar from "../../../components/BookingCalendar";
import LoadingCircle from "../../../components/LoadingCircle";
import useBookings from "../../../hooks/useBookings";
import { setCurrentBuilding } from "../../../redux/currentBuildingSlice";
import { useDispatch } from '../../../redux/hooks';
import type  {  RoomAvailability } from '../../../types';


type Event = {
	title: string;
	start: Date,
	end: Date,
}

type RoomDetails = {
	name : string;
	bookings: Array<Event>
}

export default function Page({ params }: {
  params: {room: string};
}) {
	// There should be no current building on room pages
	const dispatch = useDispatch();
	dispatch(setCurrentBuilding(null));

	const [ events, setEvents ] = React.useState<Array<Event>>([]);
	const [ roomName, setRoomName ] = React.useState<string>("");
	const handleRoomDetails = ({ name, bookings } : RoomDetails ) => {
		setRoomName(name);
		setEvents(bookings);
	}
	
	const handleError = () => {
		setEvents([]);
	}

	const { bookings, error } = useBookings(params.room);

	React.useEffect( () => {
		if (bookings) {
			handleRoomDetails(extractBookings(bookings));
		} else if (error) {
			handleError();
		}
	}, [bookings, error]);

  return (
    
    <Container maxWidth={false} sx={{ height: "100%" }}>
      { !roomName
				? <LoadingCircle/>
				: (
        <Stack justifyContent="center" alignItems="center" width="100%" py={5} height="100%">
	        <Typography variant='h4' fontWeight={550}>
	          {roomName}
	        </Typography>
					<BookingCalendar events={events} />
      </Stack>
      )}
    </Container>
    
  );
}

const extractBookings = ( bookings : RoomAvailability ) => {
	
	let allBookings : Array<Event> = [];
	for( let week = 1; week <= 10; ++week) {
		if(!( week in bookings ) ) {
			continue;
		}
		const bookingsForCurrWeek = bookings[week];
		Object.keys(bookingsForCurrWeek).forEach(( day ) => {
			const bookingForCurrDay = bookingsForCurrWeek[day];
			bookingForCurrDay.forEach((booking) => {
				allBookings.push({
					title: booking.courseCode,
					start: new Date(booking.start),
					end: new Date(booking.end),
				})
			});
		})
	}
	
	const roomDetails : RoomDetails = { name : bookings.name, bookings: allBookings };
	
	return roomDetails;
}