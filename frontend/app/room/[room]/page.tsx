"use client" 

import MenuIcon from '@mui/icons-material/Menu';
import { IconButton, useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import Container from "@mui/material/Container";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { useTheme } from "@mui/material/styles";
import Typography from '@mui/material/Typography';
import type { StaticImageData } from "next/image";
import Image from "next/image";
import React from 'react';

import BookingCalendar from "../../../components/BookingCalendar";
import Button from "../../../components/Button";
import LoadingCircle from "../../../components/LoadingCircle";
import useBookings from "../../../hooks/useBookings";
import useRoom from "../../../hooks/useRoom";
import roomImage from "../../../public/assets/building_photos/K-B16.webp";
import type { Room } from "../../../../common/types";
import useBuilding from 'hooks/useBuilding';

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
	const { bookings } = useBookings(params.room);
	const { room } = useRoom(params.room);
    const [ campus, grid ] = room ? room.id.split('-') : [ "", "" ];
    const { building } = useBuilding(`${campus}-${grid}`);

      return (
    <Container maxWidth={'xl'}>
        { room != undefined ? 
            ( <Stack justifyContent="center" alignItems="center" width="100%" py={5} height="100%" px={{ xs: 3, md: 15 }}>
                <RoomPageHeader room={room} buildingName={ building != undefined ? building.name : "" } />
			    <RoomImage src={roomImage} />
			    <BookingCalendar events={ bookings == undefined ? [] : bookings } />
            </Stack>
            ) : <LoadingCircle />  }
    </Container>
    
  );
}

const RoomPageHeader : React.FC<{ room : Room, buildingName : string }> = ({
    room,
    buildingName
}) => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const translateUsage = ( usage : string  ) => {
        switch(usage) {
            case "AUD" :
                return "Auditorium";
            case "CMLB":
                return "Computer Lab";
            case "LAB" : 
                return "Lab";
            case "LCTR":
                return "Lecture Hall";
            case "MEET":
                return "Meeting Room";
            case "SDIO":
               return "Studio";
            case "TUSM":
                return "Tutorial Room";
            default:
                return "";
        }
    }

    	return (
		<Box
			width={"100%"}
			display={"flex"}
			flexDirection={"row"}
			alignItems={'center'}
			justifyContent={"space-between"}
		>
			<Stack direction={"column"} spacing={1} width="100%">
                { buildingName != "" ? (
                    <Stack direction='row' spacing={1} >
                        <Typography display="inline" variant="subtitle2">{`${buildingName} / ${translateUsage(room.usage)}`} </Typography>
                    </Stack>
                ) : null }
				<Box display="flex" justifyContent={"space-between"} alignItems={'center'} width={'100%'} >
					<Typography variant='h4' fontWeight={550}> {room.name} </Typography>
					{ isMobile ?  <ActionMenu /> 
					: ( 
						<Stack direction={"row"} spacing={1}>
							<Button sx={{ px: 2, py: 1}}>
								<Typography variant={"body2"} fontWeight={"bold"}>Make a Booking</Typography>
							</Button>
							<Button sx={{ px: 2, py: 1}}>
								<Typography variant={"body2"} fontWeight={"bold"}>Add Photos</Typography>
							</Button>
						</Stack> )
					}	
					
				</Box>
				<Stack direction={"row"} spacing={3}  >
					<Typography variant="body1" fontWeight={"bold"}>
						ID: <Typography display={"inline"} variant="body1">{room.id}</Typography>
					</Typography>
                    <Typography variant="body1" fontWeight={"bold"}>
						Capacity: <Typography display={"inline"} variant="body1">{room.capacity}</Typography>
					</Typography>
					<Typography variant="body1" fontWeight={"bold"}>
						School: <Typography display={"inline"} variant="body1">{room.school}</Typography>
					</Typography>
				</Stack>
			</Stack>
		</Box>
	);
}

const ActionMenu : React.FC = () => {

	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
 	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};


	return (
		<Box>
			<IconButton
				id="basic-button"
				aria-controls={open ? 'basic-menu' : undefined}
				aria-haspopup="true"
				aria-expanded={open ? 'true' : undefined}
				onClick={handleClick}
      		>
				<MenuIcon />
      		</IconButton>
      		<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
				'aria-labelledby': 'basic-button',
				}}
			>
				<MenuItem onClick={handleClose}>Make a Booking</MenuItem>
				<MenuItem onClick={handleClose}>Map</MenuItem>
				<MenuItem onClick={handleClose}>Add Photos</MenuItem>
      		</Menu>
		</Box>
	);
}

const RoomImage : React.FC<{ src : StaticImageData }> = ({ src }) => {
	return (
		<Box width={"100%"} display="flex">
			<Box minWidth={"100%"} minHeight={300} position="relative" >
				<Image src={src} alt={"Room Image"} fill style={{ objectFit: "cover", borderRadius: 10 }}/>	
			</Box>
			<Button sx={{ px: 2, py: 1, position: 'relative', alignSelf: "flex-end", right: 145, bottom: 15, minWidth: 125 }}>
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
