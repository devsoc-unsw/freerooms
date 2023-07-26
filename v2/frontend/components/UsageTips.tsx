import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MapIcon from '@mui/icons-material/Map';
import Image from "next/image";
import React from 'react'

import background from "../public/assets/landing_page/usage_background.png";
import vector from "../public/assets/landing_page/usage_tips_vector.png";
import UsageCard from "./UsageCard";

const UsageTips = () => {
  return (
    <div>
      <Image
        alt={"Usage Vector"}
        src={vector}
        style={{
          marginLeft: '39%',
          marginTop: '10rem'
        }}
      />
      <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '2rem', marginTop: '-1.5rem' }}>
        Usage Tips
      </h1>
      <div
        style={{
          position: 'relative',
          marginLeft: '8%',
          backgroundImage: `url(${background.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '75rem 37rem',
          backgroundPosition: 'center',
          width: '85%',
          height: '37rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <UsageCard
          icon={<EventAvailableIcon style={{height: '3rem', width: '3rem'}}/>} 
          heading="Timetable"
          description="Check the timetable to see available rooms at UNSW and avoid scheduling conflicts."
        />
        <UsageCard
          icon={<MapIcon style={{height: '3rem', width: '3rem'}}/>} 
          heading="Timetable"
          description="Check the timetable to see available rooms at UNSW and avoid scheduling conflicts."
        />
        <UsageCard
          icon={<EventAvailableIcon style={{height: '3rem', width: '3rem'}}/>} 
          heading="Insights"
          description="Check the timetable to see available rooms at UNSW and avoid scheduling conflicts."
        />
      </div>
    </div>
  );
}

export default UsageTips;
