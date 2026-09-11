import RecurringWeeksSlider from "@frontend/components/booking/RecurringWeeksSlider";
import DropdownSelections from "@frontend/components/filters/DropdownSelections";
import {
  setAllRoomsFilter,
  unsetAllRoomsFilter,
} from "@frontend/redux/allRoomsFilterSlice";
import { useDispatch } from "@frontend/redux/hooks";
import { AllRoomsFilters, DropDownItem } from "@frontend/types";
import { allRoomsFilterDropdown } from "@frontend/utils/constants";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { BoxProps } from "@mui/system";
import { useCallback, useMemo } from "react";

const StyledFilterSideBarContainer = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
  borderColor: theme.colours.border.default,
  ":hover": {
    cursor: "auto",
  },
}));

const FilterSideBar = ({ filters }: { filters: AllRoomsFilters }) => {
  const dispatch = useDispatch();

  // Handle user selecting a filter, each dropdown select has an associated key
  const handleSelect = useCallback(
    (key: keyof AllRoomsFilters, item: DropDownItem) => {
      if (filters[key]?.includes(item.value)) {
        // If the same as already selected, unset key
        dispatch(unsetAllRoomsFilter({ key, value: item.value }));
      } else {
        // Otherwise, spread existing filters and set key
        dispatch(setAllRoomsFilter({ key, value: item.value }));
      }
    },
    [dispatch, filters]
  );

  // Recurring needs its own commiter as it's a slider instead of select list.
  const handleRecurringChange = useCallback(
    (weeks: number | null) => {
      if (weeks == null) {
        dispatch(unsetAllRoomsFilter({ key: "recurring", value: "" }));
      } else {
        dispatch(setAllRoomsFilter({ key: "recurring", value: String(weeks) }));
      }
    },
    [dispatch]
  );

  const dropdownMap = useMemo(
    () =>
      allRoomsFilterDropdown.map((dropdown) =>
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
    <StyledFilterSideBarContainer>{dropdownMap}</StyledFilterSideBarContainer>
  );
};

export default FilterSideBar;
