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
      <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '4rem', marginTop: '-1.5rem' }}>
        Usage Tips
      </h1>
      <div
        style={{
          position: 'relative',
          marginLeft: '10%',
          backgroundImage: `url(${background.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          width: '80%',
          height: '30rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2rem',
        }}
      >
        <UsageCard/>
        <UsageCard/>
        <UsageCard/>
      </div>
    </div>
  );
}

export default UsageTips;
