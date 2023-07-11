'use client'

import 'react-big-calendar/lib/css/react-big-calendar.css';

import Typography from "@mui/material/Typography";
import Box, { BoxProps } from '@mui/material/Box';
import Button, { ButtonProps } from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Stack from "@mui/material/Stack";
import { styled } from '@mui/material/styles';
import TextField, { TextFieldProps } from "@mui/material/TextField";
import ToggleButton, { ToggleButtonProps } from '@mui/material/ToggleButton';
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, getDay, isToday,parse, startOfWeek } from "date-fns";
import { da, enAU } from "date-fns/locale";
import React from "react";
import type { View } from 'react-big-calendar';
import type { Event,NavigateAction, ToolbarProps } from 'react-big-calendar';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { useDebounce } from "usehooks-ts";

import { selectDatetime } from "../redux/datetimeSlice";
import {  useSelector } from "../redux/hooks";

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

const ToolBarContainer = styled(Box)<BoxProps>(({theme}) => ({
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignContent: 'center',
	[theme.breakpoints.down('md')]: {
		display: 'none',
	},
	marginBottom: 15,
}))

const ToolBarButton = styled(Button)<ButtonProps>(( {theme} ) => ({
	border: "1px solid",
	borderColor: 'lightgray',
	color: "black",
	size: 'small',
	fontSize: '12px',
	textTransform: 'none',
	"&:hover": {
		backgroundColor: theme.palette.primary.main,
		borderColor: theme.palette.primary.main,
		color: "#fff",
	},
}))

const ViewToggleButton = styled(ToggleButton)<ToggleButtonProps>(( {theme} ) => ({
	border: "1px solid",
	borderColor: 'lightgray',
	color: "black",
	size: 'small',
	fontSize: '12px',
	textTransform: 'none',
	"&:hover, &.Mui-selected, &.Mui-selected:hover": {
		backgroundColor: theme.palette.primary.main,
		borderColor: theme.palette.primary.main,
		color: "#fff",
	},
}))

const CustomToolBar : React.FC<ToolbarProps> = ({ date, view, onNavigate, onView }) => {

	const navigationControls : { [ index : string ] : NavigateAction } = {
		"Previous" : "PREV",
		"Today" : "TODAY",
		"Next" : "NEXT" ,
	};

	const viewControls : { [ index : string ] : View } = {
		"Week" : "week",
		"Day" : "day",
	}

	return (
		<ToolBarContainer>
			<ButtonGroup sx={{ height: 30 }}>
				{ Object.entries(navigationControls).map(([displayText, navKey], index ) => <ToolBarButton key={index} onClick={() => onNavigate(navKey)}>{displayText}</ToolBarButton>) }
			</ButtonGroup>
			
			<Typography variant="h6">{date.toDateString()}</Typography>
			<ToggleButtonGroup value={view} exclusive sx={{ height: 30 }}>
				{ Object.entries(viewControls).map(([displayText, viewKey], index ) => <ViewToggleButton value={viewKey} key={index} onClick={() => onView(viewKey)}>{displayText}</ViewToggleButton>) }
			</ToggleButtonGroup>
		</ToolBarContainer>
	)
}

const BookingCalendar : React.FC<{ events : Array<Event> }>= ({ events }) => {

	const WINDOWBREAKPOINT = 900;
	const [ currView, setCurrView ] = React.useState<View>(Views.WEEK)
	const [ currWindowWidth, setCurrWindowWidth ] = React.useState(window.innerWidth);
	const debouncedWindowWidth = useDebounce(currWindowWidth, 500 );

	
	// change ( debounced ) currWindowWidth on window resize
	React.useEffect(() => {
		// Track window size
		const handleResize = () => setCurrWindowWidth(window.innerWidth);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Update calendar view when currWindowWidth update
	React.useEffect( () => {
		const handleResize = () => {
			if( debouncedWindowWidth < WINDOWBREAKPOINT ) {
				setCurrView(Views.DAY);
			} else {
				setCurrView(Views.WEEK);
			}
		}
		handleResize();
	}, [debouncedWindowWidth]);

	const { components, getNow, localizer, myEvents, scrollToTime } = React.useMemo( () => {
		return {
			components: {
				toolbar: CustomToolBar,
			},
			getNow: () => new Date(),
			localizer: dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales: enAU }),
			myEvents: events,
			scrollToTime: new Date()
		}
	}, [events]);


 	const datetime = useSelector(selectDatetime);
	const [ date, setDate ] = React.useState<Date>(datetime);
	const handleDateChange = (newDate : Date | null) => {
		if (newDate == null) {
			setDate(datetime);
		} else {
			setDate(newDate);
		}
	}

	const calendarStyles = {
		'& .rbc-allday-cell': {
			display: 'none'
		},
		'& .rbc-time-view .rbc-header': {
			borderBottom: 'none'
		}
	}

	return (
		<>
			<Stack sx={{
				height: "100%",
				width: "100%",
				px: 15,
				pt: 3,
				...calendarStyles
			}}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
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
					components={components}
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
					eventPropGetter={() => { return { style: { backgroundColor:'#f57c00', borderColor: '#f57c00'}}}}
					slotGroupPropGetter={() => {return { style: { minHeight: "50px" }}}}
					dayPropGetter={(date) => { return { style : { backgroundColor: isToday(date) ? "#fff3e0" : "white" }}}}
					min={new Date(new Date().setHours(9, 0, 0, 0))}
					max={new Date(new Date().setHours(22, 0, 0, 0))}
					showMultiDayTimes={false}
				/>
			</Stack>
		</>
	)
}

export default BookingCalendar;
