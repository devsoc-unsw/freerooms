"use client" 

import { CircularProgress } from '@mui/material';
import Box from '@mui/material/Box';
import Container from "@mui/material/Container";
import Typography from '@mui/material/Typography';
import { DateTime } from 'luxon';
import React from 'react';

import BookingCalendar from "../../../components/BookingCalendar";
import { API_URL } from "../../../config";
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

	const [ events, setEvents ] = React.useState<Array<Event>>([]);
	const [ roomName, setRoomName ] = React.useState<string>("");
	const handleRoomDetails = ({ name, bookings } : RoomDetails ) => {
		setRoomName(name);
		setEvents(bookings);
	}
	
	const handleError = () => {
		setEvents([]);
	}

	React.useEffect( () => {
		const fetchRoomBookings = () => {
			fetch( `${API_URL}/rooms/${params.room}`)
			.then( res => res.json() )
			.then( json => extractBookings(json))
			.then( allBookings => handleRoomDetails(allBookings))
			.catch(() => handleError());
		}
		
		fetchRoomBookings();
		
	}, []);

  return (
    
    <Container maxWidth={false}>
      { roomName == "" ? (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingTop: 15, color: 'orange'}}>
          <CircularProgress color={"inherit"} />
        </Box>
      ) : (
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