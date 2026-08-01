import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { selectFilters, setFilter } from "redux/filtersSlice";

import { useDispatch, useSelector } from "../redux/hooks";
import { Filters } from "../types";
import { filterBarDropdown } from "../utils/constants";

// Type for the keys of the Filters type
const queryFilter: (keyof Filters)[] = [
  "capacity",
  "usage",
  "location",
  "duration",
  "id",
];

// Create an object that maps each filter key to its values in an array
const validFilterQueries: Partial<Record<keyof Filters, string[]>> =
  Object.fromEntries(
    filterBarDropdown.map(({ key, items }) => [
      key,
      items.map((item) => item.value),
    ])
  );

const isValidFilter = (key: keyof Filters, value: string): boolean => {
  const isValid = validFilterQueries[key];
  if (isValid === undefined) return false;
  return isValid.includes(value);
};

// Function to handle query string parameters for filters in page.tsx (browse page)
const useQueryFilter = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const filters = useSelector(selectFilters);

  // Only write to query parameters on initial load
  const initialLoad = useRef(true);

  // On initial load, apply filters from query parameters to Redux state
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    let hasInvalidFilter = false;

    queryFilter.forEach((key) => {
      const value = searchParams.get(key);
      if (value && isValidFilter(key, value)) {
        dispatch(setFilter({ key, value }));
      } else {
        params.delete(key);
        hasInvalidFilter = true;
      }
    });

    // Check if need to update URL to remove invalid parameters
    if (hasInvalidFilter) {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
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

    const params = new URLSearchParams(searchParams.toString());
    queryFilter.forEach((key) => {
      const value = filters[key];
      if (value && isValidFilter(key, value)) {
        // If the filter value exists and is a valid filter key, apply to query parameters
        params.set(key, value);
      } else {
        // Remove the key if the filter value is not in the filter
        params.delete(key);
      }
    });

    // Update the URL with new query parameters
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [filters, pathname, router, searchParams]); // Update query parameters whenever filters change
};

export default useQueryFilter;
