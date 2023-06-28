'use client'

//import "../styles/calendar/css/react-big-calendar.css";
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';
import ToggleButton, { ToggleButtonProps } from '@mui/material/ToggleButton';
import Button, { ButtonProps } from "@mui/material/Button";
import Box, { BoxProps } from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import debounce from 'lodash.debounce';
import React from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import type { View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enAU } from 'date-fns/locale';
import type { ToolbarProps, NavigateAction } from 'react-big-calendar';

import { selectDatetime } from "../redux/datetimeSlice";
import {  useSelector } from "../redux/hooks";

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

const ToolBarContainer = styled(Box)<BoxProps>(({theme}) => ({
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignContent: 'center',
	[theme.breakpoints.down('md')]: {
		display: 'none',
	},
}))

const ToolBarButton = styled(Button)<ButtonProps>(( {theme} ) => ({
	borderRadius: '5px',
	border: "1px solid",
	borderColor: 'lightgray',
	color: "black",
	size: 'small',
	fontSize: '12px',
	marginBottom: '10px',
	textTransform: 'capitalize',
	"&:hover": {
		backgroundColor: theme.palette.primary.main,
		borderColor: theme.palette.primary.main,
		color: "#fff",
	  },
	
}))

const ViewToggleButton = styled(ToggleButton)<ToggleButtonProps>(( {theme} ) => ({
	marginBottom: '10px',
	textTransform: 'capitalize',
	fontSize: '12px',
	paddingTop: '5px',
	paddingBottom: '5px',
	width: '65px',
	borderRadius: '5px',
	border: "1px solid",
	borderColor: 'lightgray',
	"&:hover": {
		backgroundColor:theme.palette.primary.main,
		borderColor: theme.palette.primary.main,
		color: "#fff",
	},
	"&.Mui-selected": {
		backgroundColor: theme.palette.primary.main,
		borderColor: theme.palette.primary.main,
		color: "#fff",
	},
	"&.Mui-selected:hover" : {
		backgroundColor: theme.palette.primary.main,
		borderColor: theme.palette.primary.main,
		color: "#fff",
	}
}))


const CustomToolBar : React.FC<ToolbarProps> = ({ date, view, onNavigate, onView }) => {

	const navigationControls : { [ index : string ] : NavigateAction } = {
		"Previous" : "PREV",
		"Today" : "TODAY",
		"Next" : "NEXT" ,
	};

	const viewControls : { [ index : string ] : View } = {
		"Month" : "month",
		"Week" : "week",
		"Day" : "day", 
		"Agenda" : "agenda"
	}

	return (
		<ToolBarContainer>
			<Stack
				direction='row'
				spacing={1}
				useFlexGap
			>
				{ Object.entries(navigationControls).map(([displayText, navKey], index ) => <ToolBarButton key={index} onClick={() => onNavigate(navKey)}>{displayText}</ToolBarButton>) }
			</Stack>
			
			<Typography sx={{ align: 'center', display: 'flex', alignItems: 'center', fontSize: '16px',  }}>{date.toDateString()}</Typography>
			<Stack
				direction='row'
				spacing={1}
				useFlexGap
				sx={{
				}}
			>
				{ Object.entries(viewControls).map(([displayText, viewKey], index ) => <ViewToggleButton value={viewKey} key={index} selected={view == viewKey} onClick={() => onView(viewKey)}>{displayText}</ViewToggleButton>) }
			</Stack>
		</ToolBarContainer>
	)
}


const BookingCalendar : React.FC<{ events : Array<Event> }>= ({ events }) => {

	


	const WINDOWBREAKPOINT = 900;
	const [ currView, setCurrView ] = React.useState<View>(Views.WEEK)
	

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
	const handleDateChange = (newDate : Date| null ) => {
		if( newDate == null ) {
			setDate(datetime);
		} else {
			setDate(newDate);
		}
	}
	

	return (
		<>
			<Box sx={{ height: 800, width: '70%', paddingTop: 5 }}>
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
				/>
			</Box>
		</>
	)
}

export default BookingCalendar;
