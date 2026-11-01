import FilterChecklist from "@frontend/components/filters/FilterChecklist";
import FilterSlider from "@frontend/components/filters/FilterSlider";
import TopBarMenu from "@frontend/components/ui/TopBarMenu";
import useDateTimeQuery from "@frontend/hooks/useDateTimeQuery";
import useQueryFilter from "@frontend/hooks/useQueryFilter";
import {
  clearFilters,
  selectFilters,
  setFilter,
  unsetFilter,
} from "@frontend/redux/filtersSlice";
import { useDispatch, useSelector } from "@frontend/redux/hooks";
import { Filters } from "@frontend/types";
import { filterBarDropdown } from "@frontend/utils/constants";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import React, { useCallback } from "react";

// Filters shown as a slider. Rest are a checklist.
const SLIDER_KEYS: (keyof Filters)[] = ["capacity", "duration", "recurring"];

const FilterBar = () => {
  // Get filters from Redux
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);

  const handleValueChange = useCallback(
    (key: keyof Filters) => (value: string | null) => {
      if (value === null) {
        dispatch(unsetFilter(key));
      } else {
        dispatch(setFilter({ key, value }));
      }
    },
    [dispatch]
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
      {filterBarDropdown.map((dropdown) =>
        SLIDER_KEYS.includes(dropdown.key) ? (
          <FilterSlider
            key={dropdown.key}
            dropdown={dropdown}
            value={filters[dropdown.key]}
            onCommit={handleValueChange(dropdown.key)}
          />
        ) : (
          <FilterChecklist
            key={dropdown.key}
            dropdown={dropdown}
            value={filters[dropdown.key]}
            onSelect={handleValueChange(dropdown.key)}
          />
        )
      )}
    </TopBarMenu>
  );
};

export default FilterBar;
