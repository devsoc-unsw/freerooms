"use client" 

import translateRoomUsage from "@common/roomUsages";
import getSchoolDetails from "@common/schools";
import type { Room } from "@common/types";
import CloseIcon from "@mui/icons-material/Close";
import  {Dialog, DialogContent, DialogContentText, DialogTitle, IconButton} from '@mui/material';
import Box from '@mui/material/Box';
import Container from "@mui/material/Container";
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useBuilding from 'hooks/useBuilding';
import Image from "next/image";
import React from 'react';
import { useState } from 'react';

import BookingCalendar from "../../../components/BookingCalendar";
import Button from "../../../components/Button";
import LoadingCircle from "../../../components/LoadingCircle";
import useBookings from "../../../hooks/useBookings";
import useRoom from "../../../hooks/useRoom";


export default function Page({ params }: {
  params: {room: string}; }) {
	const { bookings } = useBookings(params.room);
	const { room } = useRoom(params.room);
    const [ campus, grid ] = room ? room.id.split('-') : [ "", "" ];
    const { building } = useBuilding(`${campus}-${grid}`);

    return (
        <Container maxWidth={'xl'}>
            { room != undefined ? 
                ( 
                <Stack justifyContent="center" alignItems="center" width="100%" py={5} height="100%" px={{ xs: 3, md: 15 }}>
                    <RoomPageHeader room={room} buildingName={ building != undefined ? building.name : "" } />
                    <RoomImage src={`/assets/building_photos/${campus}-${grid}.webp`} /> 
                    <BookingCalendar events={ bookings == undefined ? [] : bookings } />
                </Stack>
                ) : <LoadingCircle />  }
        </Container>
  );
}

const RoomPageHeader : React.FC<{ room : Room, buildingName: string }> = ({
    room, 
    buildingName
}) => {

    const [ openDialog, setDialog ] = useState(false);
    const toggleDialog = () => {
        setDialog( (isOpen) => { return !isOpen } ); 
    }

    const schoolDetails = getSchoolDetails(room.school);
	const dialogMessage = schoolDetails ? ( 
		`This room is managed by ${schoolDetails.name}. Please contact the school to request a booking` 
		) : "This room is managed externally by its associated school. Please contact the school to request a booking"

    return (
		<Box
			width={"100%"}
			display={"flex"}
			flexDirection={"row"}
			alignItems={'center'}
			justifyContent={"space-between"}
		>
			<Stack direction={"column"} spacing={1} width="100%" mb={1}>
				{buildingName != "" && (
					<Stack direction='row' spacing={2} >
						<Typography display="inline" variant="subtitle2">{`${buildingName}`} </Typography>
						<Typography display="inline" variant="subtitle2">{"/"}</Typography>
						<Typography display="inline" variant="subtitle2">{`${translateRoomUsage(room.usage)}`}</Typography>
						{ room.school != " " ? <Typography display="inline" variant="subtitle2">{"/"}</Typography> : null }
						{ room.school != " " ? <Typography display="inline" fontWeight={"bold"} color={"#e65100"} variant="subtitle2">{"ID Required"}</Typography> : null }
					</Stack>
				)}
				<Box display="flex" justifyContent={"space-between"} alignItems={'center'} width={'100%'} >
					<Typography variant='h4' fontWeight={550}> {room.name} </Typography>
					<BookingButton school={room.school} usage={room.usage} onClick={toggleDialog} />
				</Box>
				<Stack direction={"row"} spacing={2}  >
					<Typography variant="body1" fontWeight={"bold"}>
						ID: <Typography display={"inline"} variant="body1">{room.id}</Typography>
					</Typography>
                    <Typography variant="body1" fontWeight={"bold"}>
						Capacity: <Typography display={"inline"} variant="body1">{room.capacity}</Typography>
					</Typography>
                    <Typography variant="body1" fontWeight={"bold"}>
						Abbreviation: <Typography display={"inline"} variant="body1">{room.abbr}</Typography>
					</Typography>

					{room.school != " " && (
					  <Typography variant="body1" fontWeight={"bold"}>
							School: <Typography display={"inline"} variant="body1">{ schoolDetails ? schoolDetails.name : room.school }</Typography>
						</Typography>
					)}
				</Stack>
			</Stack>
			<Dialog open={openDialog} onClose={toggleDialog} PaperProps={{ sx: { borderRadius: '10px' }}}>
				<DialogTitle>
					<Typography variant={"h6"} fontWeight={"Bold"}>Booking this Room</Typography>
				</DialogTitle>
				<IconButton
					aria-label="close"
					onClick={() => setDialog(false)}
					sx={{
						position: 'absolute',
						right: 12,
						top: 12,
						color: (theme) => theme.palette.grey[500],
					}}
				>
					<CloseIcon />
				</IconButton>
				<DialogContent dividers>
					<DialogContentText>
						<Stack direction={"column"} spacing={2}>
							<Typography variant={"body1"}>
								{ dialogMessage }
							</Typography>
							{ schoolDetails ? <Typography variant={"body1"}> You can find the contact details of the school <Link target="_blank" href={schoolDetails.contactLink}>here</Link>. </Typography> : null }
						</Stack>
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</Box>

	);
}

const BookingButton : React.FC<{ school: string, usage: string, onClick : () => void }> = ({ school, usage, onClick }) => {

    let link = "";
    if( school === " " && usage === "LIB" ) link = "https://unswlibrary-bookings.libcal.com";
    else if( school === " " ) link = "https://www.learningenvironments.unsw.edu.au/make-booking/book-room";

    if (link != "") return (
			<Link target="_blank" href={link}>
				<Button  sx={{ px: 2, py: 1, height: 45 }} >
					<Typography variant={"body2"} fontWeight={"bold"}>Make a Booking</Typography>
				</Button>
			</Link>
    );

    return (
			<Button onClick={onClick} sx={{ px: 2, py: 1, height: 45 }}>
				<Typography variant={"body2"} fontWeight={"bold"}>Make a Booking</Typography>
			</Button>
    );
}

const RoomImage : React.FC<{ src : string }> = ({ src }) => {
	return (
	    <Box minWidth={"100%"} minHeight={300} position="relative" >
	        <Image src={src} alt={"Room Image"} fill style={{ objectFit: "cover", borderRadius: 10 }}/>	
		</Box>
	);
}
