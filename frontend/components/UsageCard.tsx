import React from 'react';

interface UsageCardProps {
  icon: React.ReactElement; 
  heading: string;
  description: string;
}

const UsageCard: React.FC<UsageCardProps> = ({ icon, heading, description }) => {

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '15px',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
        height: '20rem',
        width: '20rem',
        marginTop: '-4rem',
        transition: 'transform 0.3s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <div style={{marginTop: '2rem'}}>
        {icon}
      </div>
      <h2 style={{
        marginTop: '0rem', 
        fontSize: '2rem' }}>
          {heading}
      </h2>
      <div style={{
        height: '0.5rem', 
        width: '10rem', 
        backgroundColor: '#FF5C18', 
        borderRadius: '2rem', 
        marginTop: '-1rem'}}>
      </div>
      <p style={{ }}>
        {description}
      </p>
    </div>
  );
}

export default UsageCard;
