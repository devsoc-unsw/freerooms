import React from 'react'

const UsageCard = () => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '1rem',
        borderRadius: '15px',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
        height: '19rem',
        width: '19rem',
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
      {/* Content of Card 1 */}
    </div>
  );
}

export default UsageCard;
