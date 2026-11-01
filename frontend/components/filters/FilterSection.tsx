import { StyledAccordion } from "@frontend/components/filters/DropdownSelections";
import { DropDown } from "@frontend/types";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { AccordionDetails, AccordionSummary, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

const FilterSection = ({
  dropdown,
  children,
}: {
  dropdown: DropDown;
  children: ReactNode;
}) => {
  const Icon = dropdown.icon;

  return (
    <StyledAccordion
      disableGutters={true}
      elevation={0}
      sx={{
        borderTop: "none",
        "&::before": { display: "none" },
      }}
    >
      <AccordionSummary
        expandIcon={<ChevronRightIcon />}
        sx={{
          paddingX: 0,
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "rotate(-90deg)",
          },
        }}
      >
        <Stack
          direction="row"
          sx={{ alignItems: "center", gap: (theme) => `${theme.space.sm}px` }}
        >
          {Icon && <Icon fontSize="small" />}
          <Typography variant="filterTitle">{dropdown.text}</Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={(theme) => ({ padding: `0 0 ${theme.space.sm}px` })}>
        {children}
      </AccordionDetails>
    </StyledAccordion>
  );
};

export default FilterSection;
