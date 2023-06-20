'use client'

import "../styles/calendar/css/react-big-calendar.css";

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon'
import debounce from 'lodash.debounce';
import { DateTime, Settings } from 'luxon';
import React from 'react';
import { Calendar, luxonLocalizer, Views } from 'react-big-calendar';

type Event = {
	title: string;
	start: Date,
	end: Date,
}

type ViewTypes = "month" | "week" | "day" | "work_week" | "agenda"; 

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


	const WINDOWBREAKPOINT = 900;

	const [ currView, setCurrView ] = React.useState<ViewTypes>(Views.WEEK)
	

	React.useEffect(() => {
		// If calendar loaded in Mobile Screen - set to Day View

		// Check window width on resize
		const handleResize = () => {
			if( window.innerWidth < WINDOWBREAKPOINT ) {
				setCurrView(Views.DAY);
			} else {
				setCurrView(Views.WEEK);
			}
		}

		const debouncedHandleResize = debounce(handleResize, 500);

		window.addEventListener("resize", debouncedHandleResize);

		return () => {
			window.removeEventListener('resize', debouncedHandleResize);
		}

	}, []);

	const { defaultDate, getNow, localizer, myEvents, scrollToTime } = React.useMemo( () => {
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
			<Box sx={{ height: 800, width: '70%', paddingTop: 5 }}>
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
					dayLayoutAlgorithm={'no-overlap'}
					date={date}
					onNavigate={(newDate) => handleDateChange(newDate)}
					defaultView={Views.WEEK}
					events={myEvents}
					getNow={getNow}
					localizer={localizer}
					scrollToTime={scrollToTime}
					view={currView}
					onView={(newView) => setCurrView(newView)}
				/>
			</Box>
		</>
	)
}

export default BookingCalendar;
