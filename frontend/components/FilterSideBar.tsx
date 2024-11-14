import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { BoxProps } from "@mui/system";
import { useCallback, useMemo } from "react";
import {
  setAllRoomsFilter,
  unsetAllRoomsFilter,
} from "redux/allRoomsFilterSlice";
import { useDispatch } from "redux/hooks";
import { AllRoomsFilters, DropDownItem, Filters } from "types";
import { allRoomsFilterDropdown } from "utils/constants";

import DropdownSelections from "./DropdownSelections";

const StyledFilterSideBarContainer = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
  borderColor: theme.palette.mode === "light" ? "#BCBCBC" : "#3F3F3F",
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

  const dropdownMap = useMemo(
    () =>
      allRoomsFilterDropdown.map((dropdown) => (
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
    <StyledFilterSideBarContainer>{dropdownMap}</StyledFilterSideBarContainer>
  );
};

export default FilterSideBar;
