import { parseAsString, useQueryStates } from "nuqs";
import { useEffect, useRef } from "react";
import { selectFilters, setFilter } from "redux/filtersSlice";

import { useDispatch, useSelector } from "../redux/hooks";
import { Filters } from "../types";
import { filterBarDropdown } from "../utils/constants";

// Type for the keys of the Filters type
const filterQueries: (keyof Filters)[] = filterBarDropdown.map(
  ({ key }) => key
);

// Create an object that maps each filter key to its values in an array
const validFilterQueries: Partial<Record<keyof Filters, string[]>> =
  Object.fromEntries(
    filterBarDropdown.map(({ key, items }) => [
      key,
      items.map((item) => item.value),
    ])
  );

// Function to check if a given filter key and value are valid
const isValidFilter = (key: keyof Filters, value: string): boolean => {
  const isValid = validFilterQueries[key];
  if (isValid) {
    return isValid.includes(value);
  }
  return false;
};

// Function to handle query string parameters for filters in page.tsx (browse page)
const useQueryFilter = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);

  // Only write to query parameters on initial load
  const initialLoad = useRef(true);

  const [filterParams, setFilterParams] = useQueryStates(
    {
      capacity: parseAsString.withDefault(""),
      usage: parseAsString.withDefault(""),
      location: parseAsString.withDefault(""),
      duration: parseAsString.withDefault(""),
      id: parseAsString.withDefault(""),
    },
    { shallow: true }
  );

  // Apply filters from URL on load
  useEffect(() => {
    const invalidKeys: Partial<Record<keyof Filters, null>> = {};
    let hasInvalidFilter = false;

    filterQueries.forEach((key) => {
      const value = filterParams[key];
      if (value) {
        if (isValidFilter(key, value)) {
          dispatch(setFilter({ key, value }));
        } else {
          // Set as null to remove invalid filters
          invalidKeys[key] = null;
          hasInvalidFilter = true;
        }
      }
    });

    // Check if need to update URL to remove invalid parameters
    if (hasInvalidFilter) {
      setFilterParams(invalidKeys);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]); // Apply filters on initial load (when user shares link with query params), and not on subsequent loads

  // Apply filters from Redux state to URL query parameters when filters change
  useEffect(() => {
    // Skip first run to avoid overwriting query parameters on initial load with empty state
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    const params: Partial<Record<keyof Filters, string | null>> = {};

    filterQueries.forEach((key) => {
      params[key] = filters[key] ?? null;
    });

    setFilterParams(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);
};

export default useQueryFilter;
