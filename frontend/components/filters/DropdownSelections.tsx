import {
  AllRoomsFilters,
  DropDown,
  DropDownItem,
  Filters,
} from "@frontend/types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useId } from "react";

export const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.colours.surface.paper,
  transition: "all 0.1s ease-in-out",
  borderTop: `1px solid ${theme.colours.border.subtle}`,
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
  const id = useId();

  return (
    <StyledAccordion disableGutters={true} elevation={0}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${id}-content`}
        id={`${id}-header`}
        sx={{ paddingX: 0 }}
      >
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          {dropdown.text}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        id={`${id}-content`}
        sx={{
          padding: 0,
        }}
      >
        {dropdown.items.map((item) => (
          <div
            onClick={() => handleSelect(dropdown.key, item)}
            key={item.value}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            {canSelectMultiple ? (
              <Checkbox
                checked={filters[dropdown.key]?.includes(item.value)}
                role="checkbox"
                sx={{ paddingLeft: 0 }}
              />
            ) : (
              <Radio
                checked={filters[dropdown.key] === item.value}
                role="radio"
                sx={{ paddingLeft: 0 }}
              />
            )}

            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 400,
              }}
            >
              {item.text}
            </Typography>
          </div>
        ))}
      </AccordionDetails>
    </StyledAccordion>
  );
};

export default DropdownSelections;
