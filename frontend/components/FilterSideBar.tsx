import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { BoxProps } from "@mui/system";
import { useCallback, useMemo } from "react";
import {
  selectAllRoomsFilters,
  setAllRoomsFilter,
  unsetAllRoomsFilter,
} from "redux/allRoomsFilterSlice";
import { useDispatch, useSelector } from "redux/hooks";
import { AllRoomsFilter, DropDownItem } from "types";
import { allRoomsFilterDropdown } from "utils/constants";

import DropdownSelections from "./DropdownSelections";

const StyledFilterSideBarContainer = styled(Box)<BoxProps>(({ theme }) => ({
  width: 450,
  top: 100,
  left: 100,
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
}));

const FilterSideBar = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectAllRoomsFilters);

  // Handle user selecting a filter, each dropdown select has an associated key
  const handleSelect = useCallback(
    (key: keyof AllRoomsFilter, item: DropDownItem) => {
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
          canSelectMultiple={true}
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
