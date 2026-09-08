import { DropDown } from "@frontend/types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  AccordionDetails,
  AccordionSummary,
  Slider,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { StyledAccordion } from "./DropdownSelections";

const RecurringWeeksSlider = ({
  dropdown,
  value,
  onCommit,
}: {
  dropdown: DropDown;
  value?: string;
  onCommit: (weeks: number | null) => void;
}) => {
  const min = Number(dropdown.items[0].value);
  const max = Number(dropdown.items[dropdown.items.length - 1].value);
  const [prevValueProp, setPrevValueProp] = useState(value);
  const [weeks, setWeeks] = useState(() => Number(value) || min);

  if (value !== prevValueProp) {
    setPrevValueProp(value);
    setWeeks(Number(value) || min);
  }

  const label = weeks <= min ? "Any" : `${weeks} week${weeks === 1 ? "" : "s"}`;
  return (
    <StyledAccordion disableGutters={true} elevation={0}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{ paddingX: 0 }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
          {dropdown.text}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: "0 8px" }}>
        <Typography sx={{ fontSize: 14, fontWeight: 400, marginBottom: 1 }}>
          {label}
        </Typography>
        <Slider
          value={weeks}
          min={min}
          max={max}
          step={1}
          marks
          valueLabelDisplay="off"
          onChange={(event, newValue) => setWeeks(newValue as number)}
          onChangeCommitted={(event, newValue) => {
            const weeks = newValue as number;
            onCommit(weeks <= min ? null : weeks);
          }}
        />
      </AccordionDetails>
    </StyledAccordion>
  );
};

export default RecurringWeeksSlider;
