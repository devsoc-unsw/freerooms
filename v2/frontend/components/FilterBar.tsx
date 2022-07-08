import React, { useState, useEffect, useRef } from "react";
import { BuildingReturnData } from "../types";
import FilterListIcon from '@mui/icons-material/FilterList';

const FilterBar: React.FC<{
    data: BuildingReturnData
    multiSelect?: boolean; 
    }> = ({ data, multiSelect }) => {

    const [open, setOpen] = useState(false);
    const [selection, setSelection] = useState([]); 
    
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
    
    // Handling click interactions (adding + removing selected items)
    const handleOnClick = (item: React.ReactNode) => {
        if (!selection.some(current => current.id === item.id)) { // Current represents an instance when .some iterates selection
            // If not multiselect, add item to setSelection[]
            if (!multiSelect) {
                setSelection([item]);
            } else if (multiSelect) {
                setSelection([...selection, item]); // Spread current selection and add new item
            }
        } else { // Item has been selected -> want to remove selection
            let selectionRemoved = selection;
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
            <div className="dd-container">
                <div className="dd-header">
                    <p>Filter</p>
                    <p>Reset</p>
                </div>
                <div className="dd-header-action" 
                    onClick={() => toggle()}
                    // onBlur={(e: React.FocusEvent) => dismissHandler(e)}
                    >
                    <p>{open ? <FilterListIcon /> : <FilterListIcon />}</p> 
                </div>
                {open && (
                <ul className="dd-list">
                    {items.map(item => (
                        <li className="dd-item" onClick={() => handleOnClick(item)} key={item.id}>
                            <button onClick={() => handleOnClick(item)}>
                                {item.value}
                                {isItemInSelection(item) && ' Selected'} 
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            </div>
        </>
    );
};

export default FilterBar;