import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';

interface AccordionItemProps {
  title: string;
  description: string;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, description }) => {
  const [expandedPanel, setExpandedPanel] = useState(false);

  const handleChangePanel = (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpandedPanel(isExpanded);
  };

  return (
    <Accordion
      expanded={expandedPanel}
      onChange={handleChangePanel}
      style={{
        marginBottom: '2rem',
        padding: '1rem',
        borderRadius: '0.75rem',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.15)',
      }}
    >
      <AccordionSummary
        expandIcon={
          expandedPanel ? (
            <IndeterminateCheckBoxIcon style={{ color: '#FF5C18' }} />
          ) : (
            <AddBoxIcon style={{ color: '#FA8C5E' }} />
          )
        }
        aria-controls="panel2a-content"
        id="panel2a-header"
      >
        <Typography style={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography style={{ fontWeight: 'lighter' }}>
          {description}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default AccordionItem;
