"use client";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import EastIcon from "@mui/icons-material/East";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { styled } from "@mui/system";
import React, { useEffect, useState } from "react";

export default function Page() {
  return (
    <Container>
      <Stack>
        <StyledSearchBar>
          <MainFilter />
          <SearchButton />
        </StyledSearchBar>

        <StyledBody>
          <SubFilter />
          {/* should insert a room list here */}
          <Room>
            <div
              style={{
                paddingLeft: 20,
                fontWeight: "bold",
              }}
            >
              Ainsworth G03
            </div>
            <div
              style={{
                paddingLeft: 20,
              }}
            >
              Available Until 1:00pm
            </div>
          </Room>
        </StyledBody>
      </Stack>
    </Container>
  );
}

function GetWindowSize() {
  const [width, setWidth] = useState(0);

  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return width;
}

const MainFilter: React.FC<{}> = () => {
  return (
    <Stack
      direction="row"
      spacing={2}
      divider={<Divider orientation="vertical" flexItem />}
      style={{
        justifyContent: "center",
        flexGrow: 3,
      }}
    >
      <Building />
      <Capacity />
      <When />
      <Duration />
    </Stack>
  );
};

const SubFilter: React.FC<{}> = () => {
  return (
    <Stack
      flexDirection={GetWindowSize() <= 690 ? "row" : "column"}
      style={{
        padding: 3,
        flexGrow: 1,
        alignItems: GetWindowSize() <= 690 ? "center" : "stretch",
      }}
    >
      <StyledText
        style={{
          paddingRight: 8,
          paddingBottom: 10,
        }}
      >
        Filter by:
      </StyledText>
      <Stack
        flexDirection={GetWindowSize() <= 690 ? "row" : "column"}
        style={{
          marginLeft: 2,
          marginRight: 2,
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
    </Stack>
  );
};

// all components below should either be moved to another file
// or reconstructed into something else
const Building: React.FC<{}> = () => {
  return (
    <Stack
      style={{
        flexGrow: 1,
        paddingLeft: 5,
      }}
    >
      Building
    </Stack>
  );
};

const Capacity: React.FC<{}> = () => {
  return (
    <Stack
      style={{
        flexGrow: 1,
      }}
    >
      Capacity
    </Stack>
  );
};

const When: React.FC<{}> = () => {
  return (
    <Stack
      style={{
        flexGrow: 1,
      }}
    >
      When
    </Stack>
  );
};

const Duration: React.FC<{}> = () => {
  return (
    <Stack
      style={{
        flexGrow: 1,
      }}
    >
      Duration
    </Stack>
  );
};

const SearchButton: React.FC<{}> = () => {
  return (
    <Stack>
      <EastIcon />
    </Stack>
  );
};

const StyledSearchBar = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  minWidth: 0,
  borderRadius: 7,
  borderStyle: "solid",
  borderColor: "black",
  borderWidth: "thin",
  marginTop: 48,
  marginLeft: 32,
  marginRight: 32,
  marginBottom: 30,
  padding: theme.spacing(1.25),
  justifyContent: "space-between",
}));

const StyledBody = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  flexWrap: "wrap",
  margin: theme.spacing(0, 4.25),
  padding: theme.spacing(2.5),
  justifyContent: "space-between",
}));

const StyledText = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 700,
  fontFamily: "Josefin Sans",
  fontSize: "1rem",
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  boxShadow: "none",
  "&.MuiAccordion-root:before": {
    backgroundColor: theme.palette.background.default,
    height: 0,
  },
}));

const Room = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  justifyContent: "space-between",
  height: "fit-content",
  flexGrow: 5,
  borderRadius: 4,
  borderStyle: "solid",
  borderColor: "black",
  borderWidth: "thin",
  margin: 18,
  paddingTop: 10,
  paddingBottom: 10,
  paddingLeft: 18,
  paddingRight: 20,
}));
