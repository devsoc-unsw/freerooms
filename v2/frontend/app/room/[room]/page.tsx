"use client" 

import Box from '@mui/material/Box';
import Container from "@mui/material/Container";
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { StaticImageData } from "next/image";
import Image from "next/image";
import React from 'react';

import BookingCalendar from "../../../components/BookingCalendar";
import Button from "../../../components/Button";
import LoadingCircle from "../../../components/LoadingCircle";
import useBookings from "../../../hooks/useBookings";
import roomImage from "../../../public/assets/building_photos/K-B16.webp";
import { setCurrentBuilding } from "../../../redux/currentBuildingSlice";
import { useDispatch } from '../../../redux/hooks';
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
	// There should be no current building on room pages
	const dispatch = useDispatch();
	dispatch(setCurrentBuilding(null));

	const [ events, setEvents ] = React.useState<Array<Event>>([]);
	const [ roomName, setRoomName ] = React.useState<string>("");
	const handleRoomDetails = ({ name, bookings } : RoomDetails ) => {
		setRoomName(name);
		setEvents(bookings);
	}
	
	const handleError = () => {
		setEvents([]);
	}

	const { bookings, error } = useBookings(params.room);

	React.useEffect( () => {
		if (bookings) {
			handleRoomDetails(extractBookings(bookings));
		} else if (error) {
			handleError();
		}
	}, [bookings, error]);

  return (
    
    <Container maxWidth={'xl'}>
      { !roomName
				? <LoadingCircle/>
				: (
        <Stack justifyContent="center" alignItems="center" width="100%" py={5} height="100%" px={{ xs: 3, md: 15 }}>
			<RoomPageHeader roomName={roomName} roomId={"K-J17-G01"} roomAlias={"StringsME3"} roomType={"Computer Lab"} idRequired={true} />
			<RoomImage src={roomImage} /> 
			<BookingCalendar events={events} />
      </Stack>
      )}
    </Container>
    
  );
}

const RoomPageHeader : React.FC<{ roomName: string, roomId:  string, roomAlias : string, roomType: string, idRequired: boolean }> = ({
	roomName,
	roomId, 
	roomAlias, 
	roomType, 
	idRequired
}) => {
	return (
		<Box
			width={"100%"}
			display={"flex"}
			flexDirection={"row"}
			alignItems={'center'}
			justifyContent={"space-between"}
		>
			<Stack direction={"column"} spacing={1}>
				{ idRequired ? (
					<Typography variant='subtitle2'>
						<Typography display="inline" variant="subtitle2" fontWeight={"bold"}>{"CATS "}</Typography> 
							| 
						<Typography display="inline" variant="subtitle2"fontWeight={"bold"} color={"#d26038"}>{" ID Required"}</Typography> 
					</Typography>
				) : null 
				}
				<Typography variant='h4' fontWeight={550}> {roomName} </Typography>
				<Stack direction={"row"} spacing={3}>
					<Typography variant="body1" fontWeight={"bold"}>
						ID: <Typography display={"inline"} variant="body1">{roomId}</Typography>
					</Typography>
					<Typography variant="body1" fontWeight={"bold"}>
						Alias: <Typography display={"inline"} variant="body1">{roomAlias}</Typography>
					</Typography>
					<Typography variant="body1" fontWeight={"bold"}>
						Type: <Typography display={"inline"} variant="body1">{roomType}</Typography>
					</Typography>
				</Stack>
			</Stack>
			<Stack direction={"row"} spacing={1} >
				<Button sx={{ px: 2, py: 1}}>
					<Typography variant={"body2"} fontWeight={"bold"}>Make a Booking</Typography>
				</Button>
				<Button sx={{ px: 2, py: 1}}>
					<Typography variant={"body2"} fontWeight={"bold"}>Add Photos</Typography>
				</Button>
			</Stack>
		</Box>
	);
}

const RoomImage : React.FC<{ src : StaticImageData }> = ({ src }) => {
	return (
		<Box width={"100%"} display="flex">
			<Box minWidth={"100%"} minHeight={300} position="relative" >
				<Image src={src} alt={"Room Image"} fill style={{ objectFit: "cover", borderRadius: 10 }}/>	
			</Box>
			<Button sx={{ px: 2, py: 1, position: 'relative', alignSelf: "flex-end", right: 170, bottom: 25, minWidth: 125 }}>
				<Typography variant={"body2"} fontWeight={"bold"}>More Photos</Typography>
			</Button>
		</Box>
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
					start: new Date(booking.start),
					end: new Date(booking.end),
				})
			});
		})
	}
	
	const roomDetails : RoomDetails = { name : bookings.name, bookings: allBookings };
	
	return roomDetails;
}
