import FilterListIcon from "@mui/icons-material/FilterList";
import { ClickAwayListener } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import Container from "@mui/material/Container";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

import { DropDownItem } from "../types";

const StyledSortButton = styled(Box)<BoxProps>(({ theme }) => ({
  height: 56,
  width: 115,
  padding: 16,
  display: "flex",
  flexDirection: "row",
  alignSelf: "center",
  justifyItems: "center",
  position: "relative",
  borderRadius: 8,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: theme.palette.primary.main,
  zIndex: 10,
  ":hover": {
    cursor: "pointer",
  },
}));

const StyledDropDownMenu = styled(Box)<BoxProps>(({ theme }) => ({
  width: 250,
  top: 56,
  left: 0,
  borderRadius: 10,
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  backgroundColor: theme.palette.background.default,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: theme.palette.mode === "light" ? "#BCBCBC" : "#3F3F3F",
  ":hover": {
    cursor: "auto",
  },

  paddingLeft: "10px",
  paddingRight: "10px",
}));

const StyledHeader = styled(Box)<BoxProps>(() => ({
  height: 60,
  display: "inline-flex",
  alignItems: "center",
  gap: 135,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  transition: "all 0.1s ease-in-out",
  backgroundColor: theme.palette.background.default,
  borderTop: `1px solid ${theme.palette.secondary.main}`,
}));

const SortBar: React.FC<{
  sort: string;
  setSort: (sort: string) => void;
}> = ({ sort, setSort }) => {
  // Hide and close Dropdown
  const [open, setOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <StyledSortButton onClick={() => setOpen(!open)}>
        <Stack
          direction="row"
          spacing="16px"
          alignItems="center"
          // onBlur={(e: React.FocusEvent) => dismissHandler(e)}
        >
          <FilterListIcon
            sx={{ color: (theme) => theme.palette.primary.main }}
          />
          <Typography
            sx={{
              color: (theme) => theme.palette.primary.main,
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            Sort
          </Typography>
        </Stack>
        {open && (
          <Container onClick={(e) => e.stopPropagation()}>
            <StyledDropDownMenu>
              <StyledHeader>
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 700,
                  }}
                >
                  Sort
                </Typography>
              </StyledHeader>
              {dropdowns.map((dropdown) => (
                <StyledBox key={dropdown.value}>
                  <FormControlLabel
                    control={
                      <Radio checked={sort === dropdown.value} sx={{}} />
                    }
                    label={dropdown.text}
                    onClick={() => setSort(dropdown.value)}
                    sx={{
                      width: "100%",
                      py: 0.5,
                      cursor: "pointer",

                      "& .MuiFormControlLabel-label": {
                        fontSize: 14,
                        fontWeight: 500,
                      },
                    }}
                  />
                </StyledBox>
              ))}
            </StyledDropDownMenu>
          </Container>
        )}
      </StyledSortButton>
    </ClickAwayListener>
  );
};

// Dropdowns and items.
const dropdowns: DropDownItem[] = [
  {
    text: "Most Available Rooms",
    value: "mostRooms",
  },
  {
    text: "Nearest",
    value: "nearest",
  },
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
];

export default SortBar;
