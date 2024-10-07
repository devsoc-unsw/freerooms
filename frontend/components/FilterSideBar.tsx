import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { BoxProps } from "@mui/system";
import { AllRoomsFilterContext } from "app/allRooms/page";
import { useCallback, useContext, useEffect, useMemo } from "react";
import {
  selectAllRoomsFilters,
  setAllRoomsFilter,
  unsetAllRoomsFilter,
} from "redux/allRoomsFilterSlice";
import { useDispatch, useSelector } from "redux/hooks";
import { AllRoomsFilters, DropDownItem } from "types";
import { allRoomsFilterDropdown } from "utils/constants";

import DropdownSelections from "./DropdownSelections";

const StyledFilterSideBarContainer = styled(Box)<BoxProps>(({ theme }) => ({
  // borderRadius: 10,
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
  // borderWidth: 1,
  // borderStyle: "solid",
  borderColor: theme.palette.mode === "light" ? "#BCBCBC" : "#3F3F3F",
  ":hover": {
    cursor: "auto",
  },
}));

const FilterSideBar = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectAllRoomsFilters);
  const setParentFilter = useContext(AllRoomsFilterContext);

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

  useEffect(() => {
    setParentFilter(filters);
  }, [filters, setParentFilter]);

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
