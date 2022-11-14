import React, { useState, useEffect, useRef, PropsWithChildren } from "react";
import { Building, BuildingReturnData, DropDown, DropDownItem, Filters } from "../types";

import Container from '@mui/material/Container';
import Box, { BoxProps } from '@mui/material/Box';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled, Theme } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Checkbox from '@mui/material/Checkbox';

const StyledFilterButton = styled(Box)<BoxProps>(({ theme }) => ({
  height: 40,
  width: 140,
  padding: 20,
  margin: 20,
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  position: "relative",
  borderRadius: 10,
  backgroundColor: "white",
  borderWidth: 2,
  borderStyle: "solid",
  borderColor: theme.palette.primary.main,
}));

const StyledDropDownMenu = styled(Box)<BoxProps>(({ theme }) => ({
  width: 250,
  top: 50,
  left: 0,
  borderRadius: 10,
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  backgroundColor: "white",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#BCBCBC"
}));

const StyledHeader = styled(Box)<BoxProps>(({ theme }) => ({
  paddingLeft: 15,
  height: 60,
  display: "inline-flex",
  gap: 135
}));

const StyledAccordian = styled(Accordion)(({ theme }) => ({
  backgroundColor: '#fff',
  color: "#000",
  transition: "all 0.1s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  backgroundColor: "#eee",
  color: "#000"
}));

const FilterBar: React.FC<{
  filters: Filters,
  setFilters: (filters: Filters) => void
}> = ({ filters, setFilters }) => {

  // Hide and close Dropdown
  const [open, setOpen] = useState(false);
  const toggle = (open: boolean) => {
    setOpen(!open);
  }

  // Close dropdown if user clicks outside.
  const dismissHandler = (event: React.FocusEvent) => {
    if (event.currentTarget === event.target) {
      setOpen(!open);
    }
  };

  return (
    <>
      <StyledFilterButton>
        <Stack
          direction="row"
          onClick={() => toggle(open)}
          spacing={1.5}
          alignItems="center"
        // onBlur={(e: React.FocusEvent) => dismissHandler(e)}
        >
          <p>{open ? <FilterListIcon style={{ color: '#F77F00' }} /> : <FilterListIcon style={{ color: '#F77F00' }} />}</p>
          <p style={{ color: '#F77F00', fontWeight: 'bold' }}>Filters</p>
        </Stack>
        {open && (
          <Container>
            <StyledDropDownMenu>
              <StyledHeader>
                <h3>Filter</h3>
                <p style={{ color: '#F77F00' }} onClick={() => setFilters({})}>Reset</p>
              </StyledHeader>
              {items.map(item => (
                <DropdownAccordion
                  key={item.value}
                  title={item.text}
                  items={item.items}
                  keyString={item.value}
                  filters={filters}
                  setFilters={setFilters}
                />
              ))}
            </StyledDropDownMenu>
          </Container>
        )}
      </StyledFilterButton>
    </>
  );
};

const DropdownAccordion: React.FC<{
  title: string;
  items: DropDownItem[];
  filters: Filters;
  setFilters: (filters: Filters) => void;
  keyString: string;
}> = ({ title, items, filters, setFilters, keyString }) => {
  const key = keyString as keyof Filters;

  const handleClick = (item: DropDownItem) => {
    if (filters[key] === item.value) {
      const { [key]: unsetKey, ...other } = filters;
      setFilters(other);
    } else {
      setFilters({ ...filters, [key]: item.value });
    }
  };

  return (
    <StyledAccordian>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        {title}
      </AccordionSummary>
      <StyledAccordionDetails>
        {items.map(item => (
          <div onClick={(e) => { e.preventDefault(); handleClick(item) }} key={item.value}>
            <Checkbox checked={filters[key] === item.value} />
            {item.text}
          </div>
        ))}
      </StyledAccordionDetails>
    </StyledAccordian>
  );
};

// Dropdown items.
const items: DropDown[] = [
  {
    text: 'Room Usage',
    value: 'usage',
    items: [
      {
        text: 'Tutorial Classroom',
        value: 'TUT'
      },
      {
        text: 'Lecture Hall',
        value: 'LEC'
      }
    ]
  },
  {
    text: 'Room Capacity',
    value: 'capacity',
    items: [
      {
        text: '25+',
        value: '25'
      },
      {
        text: '50+',
        value: '50'
      },
      {
        text: '100+',
        value: '100'
      },
      {
        text: '200+',
        value: '200'
      }
    ]
  },
  {
    text: 'Duration Free',
    value: 'duration',
    items: [
      {
        text: '30+ minutes',
        value: '30'
      },
      {
        text: '1+ hours',
        value: '60'
      },
      {
        text: '2+ hours',
        value: '120'
      },
      {
        text: '3+ hours',
        value: '180'
      }
    ]
  },
  {
    text: 'Location',
    value: 'location',
    items: [
      {
        text: 'Upper Campus',
        value: 'upper'
      },
      {
        text: 'Lower Campus',
        value: 'lower'
      }
    ]
  },
];

export default FilterBar;
