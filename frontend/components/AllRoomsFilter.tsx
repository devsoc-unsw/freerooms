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
          fontWeight: 700,
          fontFamily: "Josefin Sans",
          width: "fit-content",
          marginRight: 2,
          backgroundColor: "green",
          fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
        }}
      >
        Filter by:
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
  backgroundColor: "pink",
  [theme.breakpoints.down("md")]: {
    alignItems: "center",
    flexDirection: "row",
  },
  [theme.breakpoints.up("md")]: {
    alignItems: "stretch",
    flexDirection: "column",
  },
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  boxShadow: "none",
  "&.MuiAccordion-root:before": {
    backgroundColor: theme.palette.background.default,
    height: 0,
  },
  disableGutters: true,
  [theme.breakpoints.down("xs")]: {
    fontSize: "0.7em",
    flexDirection: "row",
  },
  [theme.breakpoints.down("sm")]: {
    fontSize: "0.8em",
    flexDirection: "row",
  },
}));

export default AllRoomsFilter;
