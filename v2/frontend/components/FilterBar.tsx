import React, { useState, useEffect, useRef } from "react";
import { BuildingData, BuildingReturnData, DropDownItem } from "../types";

import Container from '@mui/material/Container';
import Box, { BoxProps } from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled, Theme} from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';
import StyledButton from "./Button";

const StyledFilterButton = styled(Box)(({ theme }) => ({
    height: 40,
    width: 120,
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

const StyledDropDownMenu = styled(Box)(({ theme }) => ({
    height: 400,
    width: 280,
    borderRadius: 10,
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    backgroundColor: "white",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#BCBCBC"
}));

const FilterBar: React.FC<{
    data: BuildingReturnData
    multiSelect?: boolean; 
    }> = ({ data, multiSelect }) => {
    
    // Dropdown items.
    const items = [
        {
            id: 1,
            value: 'Days',
        },
        {
            id: 2,
            value: 'Time',
        },
        {
            id: 3,
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

    // Hide and close Dropdown
    const [open, setOpen] = useState(false);

    const toggle = (open: boolean) => {
        setOpen(!open);
    }

    // Get selected item from Dropdown
    // Set active class on selected items
    const [selection, setSelection] = useState<any[]>([]); 
    
    // Check if item has been selected.
    const isItemInSelection = (item: DropDownItem) => {
        if (selection.find(current => current.id === item.id)) {
          return true;
        }
        return false;
    };
    
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
        switch(item.value) {
            case "Days":
                return itemsDisplay(days);
            case "Time":
                return itemsDisplay(times);
            case "Location":
                return itemsDisplay(locations);
            default:
                return null;
        }
    };

    const itemsDisplay = (items: DropDownItem[]) => {
        return <ul className="dayMenu">
            {items.map(item => (
                <li onClick={() => handleOnClick(item)} key={item.id}>
                    {item.value}
                    {isItemInSelection(item) && ' Selected'} 
                </li>
            ))}
        </ul>;
    }

    return (
        <>
            <StyledFilterButton>
                <Stack 
                    direction="row"
                    onClick={() => toggle(open)}
                    spacing={1.5}
                    alignItems= "center"
                    // onBlur={(e: React.FocusEvent) => dismissHandler(e)}
                    >
                    <p>{open ? <FilterListIcon /> : <FilterListIcon />}</p> 
                    <p>Filters</p>
                </Stack>
                {open && (
                <Container>
                    <StyledDropDownMenu>
                        {items.map(item => (
                            <button onClick={() => handleOnClick(item)} key={item.id}>
                                {item.value}
                                {isItemInSelection(item) && dropDownReveal(item)}
                                {/* {isItemInSelection(item) && ' Selected'}  */}
                            </button>
                        ))}
                    </StyledDropDownMenu>
                </Container>
                )}
            </StyledFilterButton>
        </>
    );
};

export default FilterBar;