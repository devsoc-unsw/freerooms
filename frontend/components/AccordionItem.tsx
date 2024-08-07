import AddBoxIcon from "@mui/icons-material/AddBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import React, { ReactElement, useState } from "react";

interface AccordionItemProps {
  title: string;
  content: ReactElement;
}

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  margin: "0 0 2rem 0 !important",
  padding: "1rem",
  maxWidth: "100%",
  borderRadius: "0.75rem",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
  backgroundColor:
    theme.palette.mode === "light" ? "#ffffff" : theme.palette.background.paper,
  "&:before": {
    backgroundColor: "rgba(0,0,0,0)",
  },
  [theme.breakpoints.down("lg")]: {
    maxWidth: "100%",
    width: "100%",
  },
}));

const AccordionItem: React.FC<AccordionItemProps> = ({ title, content }) => {
  const [expandedPanel, setExpandedPanel] = useState(false);

  const handleChangePanel = (
    event: React.ChangeEvent<{}>,
    isExpanded: boolean
  ) => {
    setExpandedPanel(isExpanded);
  };

  return (
    <StyledAccordion expanded={expandedPanel} onChange={handleChangePanel}>
      <AccordionSummary
        expandIcon={
          expandedPanel ? (
            <IndeterminateCheckBoxIcon style={{ color: "#FF5C18" }} />
          ) : (
            <AddBoxIcon style={{ color: "#FA8C5E" }} />
          )
        }
        aria-controls="panel2a-content"
        id="panel2a-header"
      >
        <Typography style={{ fontWeight: "bold" }}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography style={{ fontWeight: "lighter" }}>{content}</Typography>
      </AccordionDetails>
    </StyledAccordion>
  );
};

export default AccordionItem;
