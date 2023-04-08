"use client" 

import React from 'react';
import BookingCalendar from "../../../components/BookingCalendar";
import Container from "@mui/material/Container";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';




export default function Page({ params }: {
  params: {room: string};
}) {	
  return (
  
    <Container maxWidth={false}>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', paddingTop: 15}}>
        <Typography variant='h4' component='h2'>
          { `Bookings for ${params.room}`}
        </Typography>
	      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
					<BookingCalendar roomID={params.room} />
	      </Box>
      </Box>
      
    </Container>
    
  );
}