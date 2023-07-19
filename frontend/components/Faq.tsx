import Image from "next/image";
import React, { useState } from 'react';

import underline from "../public/assets/landing_page/underline_vector.png";
import AccordionItem from './AccordionItem';

const Faq = () => {
  
  return (
    <div>
      <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '0rem', marginTop: '10rem' }}>
        Frequently Asked Questions
      </h1>
      <Image 
      alt={"Underline Vector"} 
      src={underline} 
      style={{ 
        marginTop: '-0.5rem',
        width: '15%', 
        marginLeft: '60%',
        marginBottom: '5rem' 
      }} 
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '80%',
          alignItems: 'center',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <div style={{ width: '45%' }}>
          <AccordionItem title='What is this?' description='Include a dedicated section where users can easily submit their feedback, suggestions, or issue reports. This feature enables users to provide feedback directly within the software, enhancing user engagement and facilitating continuous improvement.'/>
          <AccordionItem title='What is this?' description='Include a dedicated section where users can easily submit their feedback, suggestions, or issue reports. This feature enables users to provide feedback directly within the software, enhancing user engagement and facilitating continuous improvement.'/>
          <AccordionItem title='What is this?' description='Include a dedicated section where users can easily submit their feedback, suggestions, or issue reports. This feature enables users to provide feedback directly within the software, enhancing user engagement and facilitating continuous improvement.'/>
        </div>
        <div style={{ width: '45%' }}>
          <AccordionItem title='What is this?' description='Include a dedicated section where users can easily submit their feedback, suggestions, or issue reports. This feature enables users to provide feedback directly within the software, enhancing user engagement and facilitating continuous improvement.'/>
          <AccordionItem title='What is this?' description='Include a dedicated section where users can easily submit their feedback, suggestions, or issue reports. This feature enables users to provide feedback directly within the software, enhancing user engagement and facilitating continuous improvement.'/>
          <AccordionItem title='What is this?' description='Include a dedicated section where users can easily submit their feedback, suggestions, or issue reports. This feature enables users to provide feedback directly within the software, enhancing user engagement and facilitating continuous improvement.'/>
        </div>
      </div>
    </div>
  );
};

export default Faq;
