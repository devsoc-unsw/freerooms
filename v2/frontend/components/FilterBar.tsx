import React, { useState, useEffect, useRef } from "react";
import { Building, BuildingReturnData, DropDownItem } from "../types";

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
    top: 100,
    padding: 20,
    margin: 20,
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
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
    data: BuildingReturnData
    multiSelect?: boolean;
}> = ({ data, multiSelect }) => {

    // Hide and close Dropdown
    const [open, setOpen] = useState(false);
    const [selection, setSelection] = useState<any[]>([]);

    const toggle = (open: boolean) => {
        setOpen(!open);
    }

    // Check if item has been selected.
    // const isItemInSelection = (item: DropDownItem) => {
    //     if (selection.find(current => current.id === item.id)) {
    //       return true;
    //     }
    //     return false;
    // };

    // Handling click interactions (adding + removing selected items)
    const handleOnClick = (item: DropDownItem) => {
        if (!selection.some(current => current.id === item.id)) { // Current represents an instance when .some iterates selection
            setSelection([...selection, item]); // Spread current selection and add new item
        } else { // Item has been selected -> want to remove selection
            let selectionRemoved = selection;
            selectionRemoved = selectionRemoved.filter(
                current => current.id !== item.id
            );
            setSelection([...selectionRemoved]);
        }
    };

    // Close dropdown if user clicks outside.
    const dismissHandler = (event: React.FocusEvent) => {
        if (event.currentTarget === event.target) {
            setOpen(!open);
        }
    };

    // Reveal correct dropdown based on selected option. 
    const dropDownReveal = (item: DropDownItem) => {
        switch (item.value) {
            case "Days":
                return itemsDisplay(days);
            case "Time Range":
                return itemsDisplay(times);
            case "Location":
                return itemsDisplay(locations);
            case "Room Capacity":
                return itemsDisplay(roomCapacity);
            default:
                return null;
        }
    };

    const itemsDisplay = (items: DropDownItem[]) => {
        return <div>
            {items.map(item => (
                <div onClick={() => handleOnClick(item)} key={item.id}>
                    <Checkbox />
                    {item.value}
                </div>
            ))}
        </div>;
    }

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
                                <p style={{ color: '#F77F00' }}>Reset</p>
                            </StyledHeader>
                            {items.map(item => (
                                <StyledAccordian>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header"
                                    >
                                        {item.value}
                                    </AccordionSummary>
                                    <StyledAccordionDetails>
                                        {dropDownReveal(item)}
                                    </StyledAccordionDetails>
                                </StyledAccordian>
                            ))}
                        </StyledDropDownMenu>
                    </Container>
                )}
            </StyledFilterButton>
        </>
    );
};

// Dropdown items.
const items = [
    {
        id: 1,
        value: 'Days',
    },
    {
        id: 2,
        value: 'Room Capacity',
    },
    {
        id: 3,
        value: 'Time Range',
    },
    {
        id: 4,
        value: 'Location',
    },
];

const days = [
    {
        id: 1,
        value: 'Monday'
    },
    {
        id: 2,
        value: 'Tuesday'
    },
    {
        id: 3,
        value: 'Wednesday'
    },
    {
        id: 4,
        value: 'Thursday'
    },
    {
        id: 5,
        value: 'Friday'
    },
    {
        id: 6,
        value: 'Saturday'
    },
    {
        id: 7,
        value: 'Sunday'
    }
];

const times = [
    {
        id: 1,
        value: '9am - 12pm'
    },
    {
        id: 2,
        value: '12pm - 3pm'
    },
    {
        id: 3,
        value: '3pm - 6pm'
    },
    {
        id: 4,
        value: '6pm - 9pm'
    }
];

const roomCapacity = [
    {
        id: 1,
        value: '1 - 4'
    },
    {
        id: 2,
        value: '4 - 8'
    },
    {
        id: 3,
        value: '8 - 12'
    }
];

const locations = [
    {
        id: 1,
        value: 'Upper Campus'
    },
    {
        id: 2,
        value: 'Lower Campus'
    }
];

export default FilterBar;