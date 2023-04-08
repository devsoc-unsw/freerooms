'use client'

import React, { useState, useEffect, useMemo, Fragment} from 'react';
import { Calendar, luxonLocalizer, Views } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Box from '@mui/material/Box';
import { DateTime, Settings } from 'luxon';

type Event = {
	id: number,
	title: string,
	start: Date,
	end: Date
}

type BookingCalendarProps = {
	events: Event[];
}

const BookingCalendar : React.FC<BookingCalendarProps> = ({ events }) => {

	const { defaultDate, getNow, localizer, myEvents, scrollToTime } = useMemo( () => {
		Settings.defaultZone = DateTime.local().zoneName;
		return {
			defaultDate: DateTime.local().toJSDate(),
			getNow: () => DateTime.local().toJSDate(),
			localizer: luxonLocalizer(DateTime),
			myEvents: events,
			scrollToTime: DateTime.local().toJSDate()
		}
	}, []);

	return (
		<>
			<Box sx={{ height: 600, width: '80%'}}>
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