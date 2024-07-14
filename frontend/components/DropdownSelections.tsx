import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import { styled } from "@mui/system";
import React from "react";
import { DropDown, DropDownItem, Filters } from "types";

const StyledAccordian = styled(Accordion)(({ theme }) => ({
  transition: "all 0.1s ease-in-out",
  backgroundColor: theme.palette.background.default,
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
  },
}));
const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
}));

const DropdownSelections: React.FC<{
  dropdown: DropDown;
  multiple: boolean;
  filters: Filters;
  handleSelect: (key: keyof Filters, item: DropDownItem) => void;
}> = ({ dropdown, multiple, filters, handleSelect }) => {
  return (
    <StyledAccordian disableGutters={true}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        {dropdown.text}
      </AccordionSummary>
      <StyledAccordionDetails>
        {dropdown.items.map((item) => (
          <div
            onClick={() => handleSelect(dropdown.key, item)}
            key={item.value}
          >
            {multiple ? (
              <Checkbox checked={filters[dropdown.key] === item.value} />
            ) : (
              <Radio checked={filters[dropdown.key] === item.value} />
            )}
            {item.text}
          </div>
        ))}
      </StyledAccordionDetails>
    </StyledAccordian>
  );
};

export default DropdownSelections;
