import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";

const AllRoomsFilter: React.FC<{}> = () => {
  return (
    <StyledMainFilter>
      <Typography
        sx={{
          color: "primary.main",
          width: "fit-content",
          marginRight: 2,
          fontWeight: 500,
          fontSize: "0.85rem",
        }}
      >
        FILTER OPTIONS
      </Typography>
      <Stack
        sx={{
          flexDirection: { xs: "row", sm: "row", md: "column" },
        }}
      >
        <StyledAccordion>
          <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
            {"Room type"}
          </AccordionSummary>
          <AccordionDetails>{"Auditorium"}</AccordionDetails>
        </StyledAccordion>

        <StyledAccordion>
          <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
            {"Location"}
          </AccordionSummary>
          <AccordionDetails>{"Upper Campus"}</AccordionDetails>
        </StyledAccordion>

        <StyledAccordion>
          <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
            {"ID Required"}
          </AccordionSummary>
          <AccordionDetails>{"Not Required"}</AccordionDetails>
        </StyledAccordion>
      </Stack>
    </StyledMainFilter>
  );
};

const StyledMainFilter = styled(Stack)(({ theme }) => ({
  alignItems: "stretch",
  flexDirection: "column",
  flexGrow: 3,
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  boxShadow: "none",
  "&.MuiAccordion-root:before": {
    backgroundColor: theme.palette.background.default,
    height: 0,
  },
  disableGutters: true,
}));

export default AllRoomsFilter;
