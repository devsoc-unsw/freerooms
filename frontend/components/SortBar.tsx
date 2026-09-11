import FilterListIcon from "@mui/icons-material/FilterList";
import { ClickAwayListener } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

import { sortBarDropdown } from "../utils/constants";
import { AppButton, AppSurface } from "./ui";

const StyledMenuAnchor = styled(Box)<BoxProps>(() => ({
  position: "relative",
  alignSelf: "center",
  zIndex: 10,
}));

const StyledDropDownMenu = styled(AppSurface)(({ theme }) => ({
  width: 250,
  top: theme.sizes.control.xl,
  left: 0,
  borderRadius: 10,
  display: "flex",
  flexDirection: "column",
  position: "absolute",
  paddingLeft: 10,
  paddingRight: 10,
  ":hover": {
    cursor: "auto",
  },
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
  borderTop: `1px solid ${theme.colours.border.subtle}`,
}));

const SortBar: React.FC<{
  sort: string;
  setSort: (sort: string) => void;
}> = ({ sort, setSort }) => {
  // Hide and close Dropdown
  const [open, setOpen] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <StyledMenuAnchor>
        <AppButton
          variant="outlined"
          aria-expanded={open}
          aria-controls={open ? "browse-sort-menu" : undefined}
          onClick={() => setOpen(!open)}
          sx={{
            height: (theme) => theme.sizes.control.xl,
            width: 115,
            padding: (theme) => `${theme.space.md}px`,
            justifyContent: "flex-start",
            borderColor: "primary.main",
            color: "primary.main",
          }}
        >
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              gap: (theme) => `${theme.space.md}px`,
            }}
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
        </AppButton>
        {open && (
          <StyledDropDownMenu id="browse-sort-menu">
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
            {sortBarDropdown.map((dropdown) => (
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
        )}
      </StyledMenuAnchor>
    </ClickAwayListener>
  );
};

export default SortBar;
