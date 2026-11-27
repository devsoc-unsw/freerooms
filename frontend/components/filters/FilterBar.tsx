import FilterChecklist from "@frontend/components/filters/FilterChecklist";
import FilterSlider from "@frontend/components/filters/FilterSlider";
import TopBarMenu from "@frontend/components/ui/TopBarMenu";
import useDateTimeQuery from "@frontend/hooks/query/useDateTimeQuery";
import useQueryFilter from "@frontend/hooks/query/useQueryFilter";
import { useDispatch, useSelector } from "@frontend/redux/hooks";
import {
  clearFilters,
  selectFilters,
  setFilter,
  unsetFilter,
} from "@frontend/redux/slices/filtersSlice";
import {
  DropDown,
  FilterKey,
  Filters,
  isMultiFilterKey,
} from "@frontend/types";
import { filterBarDropdown } from "@frontend/utils/constants";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import React, { useCallback } from "react";

const FilterBar = ({
  keys,
  options,
}: {
  keys?: (keyof Filters)[];
  options?: DropDown[];
}) => {
  // Get filters from Redux
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const dropdowns =
    options ??
    (keys
      ? filterBarDropdown.filter((dropdown) => keys.includes(dropdown.key))
      : filterBarDropdown);

  const handleValueChange = useCallback(
    (key: FilterKey) => (value: string | string[] | null) => {
      if (value === null) {
        dispatch(unsetFilter(key));
        return;
      }

      if (isMultiFilterKey(key)) {
        if (Array.isArray(value)) {
          dispatch(setFilter({ key, value }));
        }
      } else if (typeof value === "string") {
        dispatch(setFilter({ key, value }));
      }
    },
    [dispatch],
  );

  useQueryFilter();
  useDateTimeQuery();

  return (
    <TopBarMenu
      id="browse-filters-menu"
      icon={FilterAltOutlinedIcon}
      label="Filters"
      title="Filters"
      onReset={() => dispatch(clearFilters())}
    >
      {dropdowns.map((dropdown) =>
        isMultiFilterKey(dropdown.key) ? (
          <FilterChecklist
            key={dropdown.key}
            dropdown={dropdown}
            value={filters[dropdown.key]}
            onSelect={handleValueChange(dropdown.key)}
          />
        ) : (
          <FilterSlider
            key={dropdown.key}
            dropdown={dropdown}
            value={filters[dropdown.key]}
            onCommit={handleValueChange(dropdown.key)}
          />
        ),
      )}
    </TopBarMenu>
  );
};

export default FilterBar;
