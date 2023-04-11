'use client'

import React, { useMemo } from 'react';
import { Calendar, luxonLocalizer, Views } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Box from '@mui/material/Box';
import { DateTime, Settings } from 'luxon';

type Event = {
	title: string;
	start: Date,
	end: Date,
}


const BookingCalendar : React.FC<{ events : Array<Event> }>= ({ events }) => {

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
