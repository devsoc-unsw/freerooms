'use client'

import React, { useState, useEffect, useMemo, Fragment} from 'react';
import { Calendar, luxonLocalizer, Views } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Box from '@mui/material/Box';
import { DateTime, Settings } from 'luxon';


const defaultTimeZone = DateTime.local().zoneName;



const BookingCalendar : React.FC = () => {

	const { defaultDate, getNow, localizer, myEvents, scrollToTime } = useMemo( () => {
		Settings.defaultZone = defaultTimeZone;
		return {
			defaultDate: DateTime.local().toJSDate(),
			getNow: () => DateTime.local().toJSDate(),
			localizer: luxonLocalizer(DateTime),
			myEvents: [{
				id: 0,
				title: "Example Event",
				allDay: true,
				start: new Date(2023, 4, 8),
				end: new Date(2023, 4, 8),
			}],
			scrollToTime: DateTime.local().toJSDate()
		}
	}, []);

	return (
		<Fragment>
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
		</Fragment>
	)
}

export default BookingCalendar;