import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { ClickAwayListener } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useCallback, useMemo, useState } from "react";

import {
  clearFilters,
  selectFilters,
  setFilter,
  unsetFilter,
} from "../redux/filtersSlice";
import { useDispatch, useSelector } from "../redux/hooks";
import { DropDownItem, Filters } from "../types";
import { filterBarDropdown } from "../utils/constants";
import DropdownSelections from "./DropdownSelections";

const StyledFilterButton = styled(Box)<BoxProps>(({ theme }) => ({
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
  paddingLeft: "10px",
  paddingRight: "10px",
  backgroundColor: theme.palette.background.default,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: theme.palette.mode === "light" ? "#BCBCBC" : "#3F3F3F",
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

const FilterBar = () => {
  // Get filters from Redux
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);

  // Hide and close Dropdown
  const [open, setOpen] = useState(false);

  // Handle user selecting a filter, each dropdown select has an associated key
  const handleSelect = useCallback(
    (key: keyof Filters, item: DropDownItem) => {
      if (filters[key] === item.value) {
        // If the same as already selected, unset key
        dispatch(unsetFilter(key));
      } else {
        // Otherwise, spread existing filters and set key
        dispatch(setFilter({ key, value: item.value }));
      }
    },
    [dispatch, filters]
  );

  const dropdownMap = useMemo(
    () =>
      filterBarDropdown.map((dropdown) => (
        <DropdownSelections
          key={dropdown.key}
          dropdown={dropdown}
          canSelectMultiple={false}
          filters={filters}
          handleSelect={handleSelect}
        />
      )),
    [filters, handleSelect]
  );

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <StyledFilterButton onClick={() => setOpen(!open)}>
        <Stack direction="row" spacing="16px" alignItems="center">
          <FilterAltIcon
            sx={{
              fill: "none",
              stroke: (theme) => theme.palette.primary.main,
              strokeWidth: 2,
            }}
          />
          <Typography
            sx={{
              color: (theme) => theme.palette.primary.main,
              fontSize: 16,
              fontWeight: 500,
            }}
          >
            Filters
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
                  Filter
                </Typography>
                <Typography
                  color="primary"
                  sx={{
                    "&:hover": { cursor: "pointer" },
                    fontSize: 16,
                  }}
                  onClick={() => dispatch(clearFilters())}
                >
                  Reset
                </Typography>
              </StyledHeader>
              {dropdownMap}
            </StyledDropDownMenu>
          </Container>
        )}
      </StyledFilterButton>
    </ClickAwayListener>
  );
};

export default FilterBar;
