import RecurringWeeksSlider from "@frontend/components/booking/RecurringWeeksSlider";
import DropdownSelections from "@frontend/components/filters/DropdownSelections";
import { AppButton, AppSurface } from "@frontend/components/ui";
import useDateTimeQuery from "@frontend/hooks/useDateTimeQuery";
import useQueryFilter from "@frontend/hooks/useQueryFilter";
import {
  clearFilters,
  selectFilters,
  setFilter,
  unsetFilter,
} from "@frontend/redux/filtersSlice";
import { useDispatch, useSelector } from "@frontend/redux/hooks";
import { DropDownItem, Filters } from "@frontend/types";
import { filterBarDropdown } from "@frontend/utils/constants";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { ClickAwayListener } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React, { useCallback, useMemo, useState } from "react";

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

  const handleRecurringChange = useCallback(
    (weeks: number | null) => {
      if (weeks === null) {
        dispatch(unsetFilter("recurring"));
      } else {
        dispatch(setFilter({ key: "recurring", value: String(weeks) }));
      }
    },
    [dispatch]
  );

  // Apply filters from query strings
  useQueryFilter();
  useDateTimeQuery();

  const dropdownMap = useMemo(
    () =>
      filterBarDropdown.map((dropdown) =>
        dropdown.key === "recurring" ? (
          <RecurringWeeksSlider
            key={dropdown.key}
            dropdown={dropdown}
            value={filters.recurring}
            onCommit={handleRecurringChange}
          />
        ) : (
          <DropdownSelections
            key={dropdown.key}
            dropdown={dropdown}
            canSelectMultiple={false}
            filters={filters}
            handleSelect={handleSelect}
          />
        )
      ),
    [filters, handleSelect, handleRecurringChange]
  );

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <StyledMenuAnchor>
        <AppButton
          variant="outlined"
          aria-expanded={open}
          aria-controls={open ? "browse-filters-menu" : undefined}
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
        </AppButton>
        {open && (
          <StyledDropDownMenu id="browse-filters-menu">
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
        )}
      </StyledMenuAnchor>
    </ClickAwayListener>
  );
};

export default FilterBar;
