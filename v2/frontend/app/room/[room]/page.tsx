"use client" 

import Box from '@mui/material/Box';
import Container from "@mui/material/Container";
import Typography from '@mui/material/Typography';
import { DateTime } from 'luxon';
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
    
    <Container maxWidth={false}>
      { !roomName
				? <LoadingCircle/>
				: (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingTop: 15}}>
	        <Typography variant='h4' component='h2'>
	          { `Bookings for ${roomName}`}
	        </Typography>
		      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
						<BookingCalendar events={events} />
		      </Box>
      </Box>
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
					start: DateTime.fromISO(booking.start).toJSDate(),
					end: DateTime.fromISO(booking.end).toJSDate(),
				})
			});
		})
	}
	
	const roomDetails : RoomDetails = { name : bookings.name, bookings: allBookings };
	
	return roomDetails;
}