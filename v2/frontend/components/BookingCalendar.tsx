'use client'

import React, { useMemo } from 'react';
import { Calendar, luxonLocalizer, Views } from 'react-big-calendar';
import "react-big-calendar/lib/css/react-big-calendar.css";
import Box from '@mui/material/Box';
import { DateTime, Settings } from 'luxon';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import { Typography } from '@mui/material';

type Event = {
	title: string;
	start: Date,
	end: Date,
}

const customDatePickerComponent = (
	params: JSX.IntrinsicAttributes & TextFieldProps,
) => (
	<TextField
		{...params}
		sx={{
			size: "Small",
			svg: { color: "#000000" },
			input: { color: "#000000" },
		}}
	/>
);


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
	
	const [ date, setDate ] = React.useState<Date>(DateTime.local().toJSDate());
	const handleDateChange = (newDate : Date| null ) => {
		console.log(newDate);
		if( newDate == null ) {
			setDate(DateTime.local().toJSDate());
		} else {
			setDate(new Date(newDate));
		}
	}
	

	return (
		<>
			<Box sx={{ height: 600, width: '70%', paddingTop: 5 }}>
				<LocalizationProvider dateAdapter={AdapterLuxon}>
				<Box sx={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "Center", paddingBottom: 5 }}>
					<Typography variant='body1' sx={{ paddingRight: 2 }}>
	          { "Select a Date:" }
	        </Typography>
					<DatePicker
            inputFormat="dd/MM/yyyy"
            value={date}
            onChange={(newDate) => { handleDateChange(newDate) }}
            renderInput={customDatePickerComponent}
          />
        </Box>
				</LocalizationProvider>
				<Calendar
					date={date}
					onNavigate={(newDate) => handleDateChange(newDate)}
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
