import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { ReactElement, useId, useState } from "react";

interface AccordionItemProps {
  title: string;
  content: ReactElement;
}

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  width: "100%",
  minWidth: 0,
  margin: 0,
  border: `1px solid ${theme.colours.accent.secondary}`,
  borderRadius: theme.radius.lg,
  boxShadow: "none",
  backgroundImage: "none",
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.colours.background.primary
      : theme.colours.surface.paper,

  "&:before": {
    display: "none",
  },

  "&.Mui-expanded": {
    margin: 0,
  },
}));

const StyledSummary = styled(AccordionSummary)(({ theme }) => ({
  minHeight: theme.space.xxl,
  paddingInline: theme.space.md,

  "&.Mui-expanded": {
    minHeight: theme.space.xxl,
  },

  "& .MuiAccordianSummary-content": {
    marginBlock: theme.space.md,
  },

  "& .MuiAccordianSummary-content.Mui-expanded": {
    marginBlock: theme.space.md,
  },

  "& .MuiAccordianSummary-expandIconWrapper": {
    color: theme.colours.text.primary,
  },

  "& .MuiAccordianSummary-expandIconWrapper.Mui-expanded": {
    transform: "none",
  },
}));

const StyledDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.space.md,
  paddingTop: theme.space.none,
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  color: theme.colours.text.primary,
  fontSize: 16,
  fontWeight: theme.typography.fontWeightRegular,
  lineHeight: 1.4,

  [theme.breakpoints.down("sm")]: {
    fontSize: 14,
  },
}));

const StyledContent = styled(Typography)(({ theme }) => ({
  color: theme.colours.text.secondary,
  fontSize: 14,
  lineHeight: 1.5,
}));

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content }) => {
  const [expandedPanel, setExpandedPanel] = useState(false);
  const id = useId();

  const handleChangePanel = (
    _event: React.SyntheticEvent,
    isExpanded: boolean
  ) => {
    setExpandedPanel(isExpanded);
  };

  return (
    <StyledAccordion
      expanded={expandedPanel}
      onChange={handleChangePanel}
      elevation={0}
    >
      <StyledSummary
        expandIcon={
          expandedPanel ? (
            <RemoveIcon fontSize="small" />
          ) : (
            <AddIcon fontSize="small" />
          )
        }
        aria-controls={`${id}-content`}
        id={`${id}-header`}
      >
        <StyledTitle>{title}</StyledTitle>
      </StyledSummary>

      <StyledDetails>
        <StyledContent>{content}</StyledContent>
      </StyledDetails>
    </StyledAccordion>
  );
};

export default AccordionItem;
