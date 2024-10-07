import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import { styled } from "@mui/system";
import React from "react";
import { AllRoomsFilters, DropDown, DropDownItem, Filters } from "types";

const StyledAccordion = styled(Accordion)(({ theme }) => ({
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
  canSelectMultiple: boolean;
  filters: Filters | AllRoomsFilters;
  handleSelect: (
    key: keyof Filters | keyof AllRoomsFilters,
    item: DropDownItem
  ) => void;
}> = ({ dropdown, canSelectMultiple, filters, handleSelect }) => {
  return (
    <StyledAccordion
      disableGutters={true}
      elevation={canSelectMultiple ? 0 : undefined}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        style={canSelectMultiple ? { padding: "10px 15px" } : {}}
      >
        {dropdown.text}
      </AccordionSummary>
      <StyledAccordionDetails>
        {dropdown.items.map((item) => (
          <div
            onClick={() => handleSelect(dropdown.key, item)}
            key={item.value}
          >
            {canSelectMultiple ? (
              <Checkbox
                checked={filters[dropdown.key]?.includes(item.value)}
                role="checkbox"
              />
            ) : (
              <Radio
                checked={filters[dropdown.key] === item.value}
                role="radio"
              />
            )}
            {item.text}
          </div>
        ))}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default DropdownSelections;
