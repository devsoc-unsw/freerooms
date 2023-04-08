'use client'

import React, { useState, useEffect, useMemo, Fragment} from 'react';
import { Calendar, luxonLocalizer, Views } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Box from '@mui/material/Box';
import { DateTime, Settings } from 'luxon';
import type  { ClassList, Class } from '../types';
import { API_URL } from "../config";

type RoomBookings = {
	[ week : string ] : {
		[ day : string ] : ClassList 
	}
}

type Event = {
	title: string;
	start: Date,
	end: Date,
}

const BookingCalendar : React.FC<{ roomID : string }>= ({ roomID }) => {


	const [ events, setEvents ] = useState<Array<Event>>([]);

	React.useEffect( () => {
		const fetchRoomBookings = () => {
			fetch( `${API_URL}/rooms/${roomID}`)
			.then( res => res.json() )
			.then( json => extractBookings(json))
			.then( allBookings => setEvents(allBookings))
			.catch(() => setEvents([]));
		}
		
		fetchRoomBookings();
		
	}, []);
	
	const { defaultDate, getNow, localizer, myEvents, scrollToTime } = useMemo( () => {
		Settings.defaultZone = DateTime.local().zoneName;
		return {
			defaultDate: DateTime.local().toJSDate(),
			getNow: () => DateTime.local().toJSDate(),
			localizer: luxonLocalizer(DateTime),
			myEvents: events,
			scrollToTime: DateTime.local().toJSDate()
		}
	}, [events]);

	return (
		<>
			<Box sx={{ height: 600, width: '70%', paddingTop: 5 }}>
				<Calendar
					defaultDate={defaultDate}
					defaultView={Views.WEEK}
					events={myEvents}
					getNow={getNow}
					localizer={localizer}
					scrollToTime={scrollToTime}
				/>
			</Box>
		</>
	)
}

export default BookingCalendar;

const extractBookings = ( bookings : RoomBookings ) => {

	let allBookings : Array<Event> = [];
	for( let week = 1; week < 10; ++week) {
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
	return allBookings;
}