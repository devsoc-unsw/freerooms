'use client'

import 'react-big-calendar/lib/css/react-big-calendar.css';

import Box from '@mui/material/Box';
import Button, { ButtonProps } from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Stack from "@mui/material/Stack";
import { styled, SxProps, useTheme } from "@mui/material/styles";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import ToggleButton, { ToggleButtonProps } from '@mui/material/ToggleButton';
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, getDay, isToday, parse, startOfWeek } from "date-fns";
import { enAU } from "date-fns/locale";
import React from "react";
import type { DateRange, View } from "react-big-calendar";
import type { Event, NavigateAction, ToolbarProps } from 'react-big-calendar';
import { Calendar, dateFnsLocalizer, DateLocalizer, Views } from "react-big-calendar";

import { selectDatetime } from "../redux/datetimeSlice";
import { useSelector } from "../redux/hooks";

const DatePickerTextField = (
	params: React.JSX.IntrinsicAttributes & TextFieldProps,
) => (
	<TextField
		{...params}
		size="small"
		sx={{
			svg: { color: "#000000" },
			input: { color: "#000000" },
			width: { xs: '100%', md: 200 },
			borderColor: "rgba(0, 0, 0, 0.12)",
		}}
	/>
);

const ToolBarButton = styled(Button)<ButtonProps>(({ theme }) => ({
	borderColor: "rgba(0, 0, 0, 0.12)",
	color: "black",
	fontSize: '12px',
	textTransform: 'none',
	"&:hover": {
		backgroundColor: theme.palette.primary.main,
		borderColor: theme.palette.primary.main,
		color: "#fff",
	},
}))

const ViewToggleButton = styled(ToggleButton)<ToggleButtonProps>(({ theme }) => ({
	color: "black",
	fontSize: '12px',
	textTransform: 'none',
	"&:hover, &.Mui-selected, &.Mui-selected:hover": {
		backgroundColor: theme.palette.primary.main,
		borderColor: theme.palette.primary.main,
		color: "#fff",
	},
}))

const CustomToolBar: React.FC<ToolbarProps> = ({ view, onNavigate, onView }) => {
	const navigationControls: { [index: string]: NavigateAction } = {
		"Previous" : "PREV",
		"Today" : "TODAY",
		"Next" : "NEXT" ,
	};

	const viewControls : { [index: string]: View } = {
		"Week" : "week",
		"Day" : "day",
	}

	return (
		<Stack
			direction="row"
			justifyContent="space-between"
			mb={2}
			sx={theme => ({
				[theme.breakpoints.down('md')]: {
					display: 'none',
				},
			})}
		>
			<ButtonGroup sx={{ height: 30 }}>
				{Object.entries(navigationControls).map(([displayText, navKey], index) =>
					<ToolBarButton key={index} onClick={() => onNavigate(navKey)}>
						{displayText}
					</ToolBarButton>
				)}
			</ButtonGroup>
			<ToggleButtonGroup value={view} exclusive sx={{ height: 30 }}>
				{Object.entries(viewControls).map(([displayText, viewKey], index) =>
					<ViewToggleButton value={viewKey} key={index} onClick={() => onView(viewKey)}>
						{displayText}
					</ViewToggleButton>
				)}
			</ToggleButtonGroup>
		</Stack>
	)
}

const BookingCalendar : React.FC<{ events : Array<Event> }>= ({ events }) => {

	// Enforce day view on mobile
	const [currView, setCurrView] = React.useState<View>(Views.WEEK);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));
	React.useEffect(() => {
		setCurrView(isMobile ? Views.DAY : Views.WEEK);
	}, [isMobile]);

	const datetime = useSelector(selectDatetime);
	const [date, setDate] = React.useState<Date>(datetime);
	const handleDateChange = (newDate: Date | null) => {
		setDate(newDate ?? datetime);
	}

	const { components, getNow, localizer, myEvents, scrollToTime } = React.useMemo(() => {
		return {
			components: {
				toolbar: CustomToolBar,
			},
			getNow: () => new Date(),
			localizer: dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales: enAU }),
			myEvents: events,
			scrollToTime: datetime
		}
	}, [datetime, events]);

	const calendarStyles: SxProps = {
		'& .rbc-allday-cell': {
			display: 'none'
		},
		'& .rbc-time-view .rbc-header': {
			borderBottom: 'none'
		},
		'& .rbc-events-container': {
			marginX: "1px !important"
		},
		'& .rbc-header': {
			paddingY: 0.5,
			fontSize: 16
		},
		'& .rbc-event-content': {
			fontWeight: 500
		},
		'& .rbc-time-view': {
			boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
			border: 'none',
			borderRadius: '12px',
		},
		'& .rbc-header:last-child, & .rbc-time-header': {
			borderTopRightRadius: '12px',
			borderRight: 'none'
		},
		'& .rbc-time-content': {
			borderBottomLeftRadius: '12px',
			borderBottomRightRadius: '12px',
			...(currView === "day" ? {
				borderTop: 'none',
				borderTopRightRadius: '12px',
			} : {})
		},
	}

	const formatTime = (date: Date, culture: string | undefined, localizer?: DateLocalizer) => {
		if (!localizer) {
			throw new Error("No date localizer");
		}
		let res = localizer.format(date, "h", culture);
		if (date.getMinutes() !== 0) {
			res += localizer.format(date, ":m", culture);
		}
		res += localizer.format(date, " a", culture);
		return res;
	}

	const formatTimeRange = (
		{ start, end }: DateRange,
		culture: string | undefined,
		localizer?: DateLocalizer
	) => {
		return formatTime(start, culture, localizer) + " - " + formatTime(end, culture, localizer);
	}

	return (
		<>
			<Stack
				justifyContent="flex-start"
				sx={{
					height: "100%",
					width: "100%",
					px: { xs: 3, md: 15 },
					pt: 3,
					...calendarStyles
				}}
			>
				<Stack
					direction={{ xs: "column", md: "row"}}
					justifyContent="space-between"
					spacing={1}
					sx={{ width: "100%", pb: 2 }}
				>
					<Typography variant="h5" fontWeight="bold">
						Room Bookings
					</Typography>
					<LocalizationProvider dateAdapter={AdapterDateFns}>
						<DatePicker
							inputFormat="iii, d MMM yyyy"
							value={date}
							onChange={(newDate) => { handleDateChange(newDate) }}
							renderInput={DatePickerTextField}
						/>
					</LocalizationProvider>
				</Stack>
				<Box overflow="auto" p={0.5}>
					<Calendar
						components={components}
						dayLayoutAlgorithm={'no-overlap'}
						date={date}
						onNavigate={handleDateChange}
						defaultView={Views.WEEK}
						events={myEvents}
						getNow={getNow}
						localizer={localizer}
						scrollToTime={scrollToTime}
						view={currView}
						onView={setCurrView}
						eventPropGetter={() => ({ style: { backgroundColor: '#f57c00', borderColor: '#f57c00'}})}
						slotGroupPropGetter={() => ({ style: { minHeight: "50px" }})}
						dayPropGetter={(date) => ({ style: { backgroundColor: isToday(date) ? "#fff3e0" : "white" }})}
						min={new Date(0, 0, 0, 9)}
						max={new Date(0, 0, 0, 22)}
						showMultiDayTimes={false}
						formats={{
							timeGutterFormat: formatTime,
							eventTimeRangeFormat: formatTimeRange
						}}
					/>
				</Box>
			</Stack>
		</>
	)
}

export default BookingCalendar;
