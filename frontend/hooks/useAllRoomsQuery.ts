import { parseAsString, useQueryStates } from "nuqs";
import { useEffect, useRef } from "react";
import {
  selectAllRoomsFilters,
  setAllRoomsFilter,
} from "redux/allRoomsFilterSlice";

import { useDispatch, useSelector } from "../redux/hooks";
import { AllRoomsFilters } from "../types";
import { allRoomsFilterDropdown } from "../utils/constants";

const useAllRoomsQuery = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectAllRoomsFilters);

  // Only write to query parameters on initial load
  const initialLoad = useRef(true);

  const filterQueries = allRoomsFilterDropdown.map(
    ({ key }) => key
  ) as (keyof typeof filterParams)[];

  const validFilterQueries: Partial<Record<keyof AllRoomsFilters, string[]>> =
    Object.fromEntries(
      allRoomsFilterDropdown.map(({ key, items }) => [
        key,
        items.map((item) => item.value),
      ])
    );

  const isValidFilter = (
    key: keyof AllRoomsFilters,
    value: string
  ): boolean => {
    const isValid = validFilterQueries[key];
    if (isValid) {
      return isValid.includes(value);
    }
    return false;
  };

  const [filterParams, setFilterParams] = useQueryStates(
    {
      usage: parseAsString.withDefault(""),
      location: parseAsString.withDefault(""),
      duration: parseAsString.withDefault(""),
      recurring: parseAsString.withDefault("")
    },
    { shallow: true }
  );

  // Apply filters from URL on load
  useEffect(() => {
    const invalidKeys: Partial<Record<keyof AllRoomsFilters, null>> = {};
    let hasInvalidFilter = false;

    filterQueries.forEach((key) => {
      const value = filterParams[key];
      if (value) {
        if (isValidFilter(key, value)) {
          dispatch(setAllRoomsFilter({ key, value }));
        } else {
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

    const params: Partial<Record<keyof AllRoomsFilters, string | null>> = {};
    filterQueries.forEach((key) => {
      params[key] = filters[key] ?? null;
    });
    setFilterParams(params);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);
};

export default useAllRoomsQuery;
