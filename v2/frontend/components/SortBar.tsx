import FilterListIcon from "@mui/icons-material/FilterList";
import Accordion from "@mui/material/Accordion";
import Box, { BoxProps } from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";

import { DropDownItem } from "../types";

const StyledSortButton = styled(Box)<BoxProps>(({ theme }) => ({
  height: 40,
  width: 140,
  padding: 20,
  display: "flex",
  flexDirection: "row",
  alignSelf: "center",
  justifyItems: "center",
  position: "relative",
  borderRadius: 10,
  backgroundColor: "white",
  borderWidth: 2,
  borderStyle: "solid",
  borderColor: theme.palette.primary.main,
  zIndex: 10,
}));

const StyledDropDownMenu = styled(Box)<BoxProps>(() => ({
  width: 250,
  top: 50,
  right: 0,
  borderRadius: 10,
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  backgroundColor: "white",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "#BCBCBC",
}));

const StyledHeader = styled(Box)<BoxProps>(() => ({
  paddingLeft: 15,
  height: 60,
  display: "inline-flex",
  gap: 135,
}));

const StyledAccordian = styled(Accordion)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#000",
  transition: "all 0.1s ease-in-out",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
  },
}));

const SortBar: React.FC<{
  sort: string,
  setSort: (sort: string) => void
}> = ({ sort, setSort }) => {

  // Hide and close Dropdown
  const [open, setOpen] = useState(false);

  return (
    <>
      <StyledSortButton onClick={() => setOpen(!open)}>
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          // onBlur={(e: React.FocusEvent) => dismissHandler(e)}
        >
          <p>{open ? <FilterListIcon style={{ color: "#F77F00" }} /> :
            <FilterListIcon style={{ color: "#F77F00" }} />}</p>
          <p style={{ color: "#F77F00", fontWeight: "bold" }}>Sort</p>
        </Stack>
        {open && (
          <Container onClick={e => e.stopPropagation()}>
            <StyledDropDownMenu>
              <StyledHeader>
                <h3>Sort</h3>
              </StyledHeader>
              {dropdowns.map(dropdown => (
                <StyledAccordian key={dropdown.value}>
                  <div onClick={() => setSort(dropdown.value)} key={dropdown.value}>
                    <Checkbox checked={sort === dropdown.value} />
                    {dropdown.text}
                  </div>
                </StyledAccordian>
              ))}
            </StyledDropDownMenu>
          </Container>
        )}
      </StyledSortButton>
    </>
  );
};

// Dropdowns and items.
const dropdowns: DropDownItem[] = [
  {
    text: "Alphabetical",
    value: "alphabetical",
  },
  {
    text: "Reverse Alphabetical",
    value: "reverseAlphabetical",
  },
  {
    text: "Lower Campus",
    value: "lowerToUpper",
  },
  {
    text: "Upper Campus",
    value: "upperToLower",
  },
  {
    text: "Most Available Rooms",
    value: "mostRooms",
  },
];

export default SortBar;
