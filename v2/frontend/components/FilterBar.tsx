import React, { useState, useEffect, useRef } from "react";
import { BuildingReturnData } from "../types";
import FilterListIcon from '@mui/icons-material/FilterList';

const FilterBar: React.FC<{
    data: BuildingReturnData
    multiSelect?: boolean; 
    }> = ({ data, multiSelect }) => {

    const [open, setOpen] = useState(false);
    const [selection, setSelection] = useState([]); // Array holds selected items.
    
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

    // Toggle dropDown on and off.
    const toggle = () => setOpen(!open);
    

    const handleOnClick = (item: React.ReactNode) => {
        // Selection is unique
        if (!selection.some(current => current.id === item.id)) { // Current represents an instance when .some iterates selection
            // If not multiselect, add item to setSelection arr. 
            if (!multiSelect) {
                setSelection([item]);
            } else if (multiSelect) { // Otherwise multiselect, let users select multiple items.
                setSelection([...selection, item]); // Spread current selection and add new item
            }
        } else { // Item has been selected -> want to remove selection
            let selectionRemoved = selection;
            // Want to return a new array called 'selectionRemoved'
            // We use filter to grab all items except for the one selected.
            selectionRemoved = selectionRemoved.filter(
                current => current.id !== item.id
            );
            setSelection([...selectionRemoved]);
        }
    };

    // Check if item has been selected.
    const isItemInSelection = (item: React.ReactNode) => {
        if (selection.find(current => current.id === item.id)) {
          return true;
        }
        return false;
    };

    // Close dropdown if user clicks outside.
    const dismissHandler = (event: React.FocusEvent) => {
        if (event.currentTarget === event.target) {
            setOpen(!open);
        }
    };

    return (
        <>
            <button 
                onClick={() => toggle()}
                // onBlur={(e: React.FocusEvent) => dismissHandler(e)}
            >
                <div className="dropDown-header__title">
                    <p>Filter</p>
                    <p>Reset</p>
                </div>
                <FilterListIcon />
                <div className="dropDown-header__action">
                    {/* If dd is opened, show close otherwise show open */}
                    <p>{open ? 'Close' : 'Open'}</p> 
                </div>
                {open && (
                <ul className="dropDown-list">
                    {items.map(item => (
                        <li className="dropDown-item" key={item.id}>
                            <button type="button" onClick={() => handleOnClick(item)}>
                                <span>{item.value}</span>
                                <span>{isItemInSelection(item) && ' Selected'}</span> 
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            </button>
        </>
    );
};

export default FilterBar;