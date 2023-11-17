import AddBoxIcon from "@mui/icons-material/AddBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import React, { useState } from "react";

interface AccordionItemProps {
  title: string;
  description: string;
}

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: "2rem",
  marginLeft: "1rem",
  marginRight: "1rem",
  padding: "1rem",
  maxWidth: "40%",
  borderRadius: "0.75rem",
  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.15)",
  "&:before": {
    backgroundColor: "rgba(0,0,0,0)",
  },
  [theme.breakpoints.down("lg")]: {
    maxWidth: "100%",
    width: "100%",
  },
}));

const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  description,
}) => {
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
        <Typography style={{ fontWeight: "lighter" }}>{description}</Typography>
      </AccordionDetails>
    </StyledAccordion>
  );
};

export default AccordionItem;
