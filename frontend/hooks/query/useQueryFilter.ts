import { useDispatch, useSelector } from "@frontend/redux/hooks";
import { selectFilters, setFilter } from "@frontend/redux/slices/filtersSlice";
import { FilterKey, isMultiFilterKey } from "@frontend/types";
import {
  bookingsFilterDropdown,
  filterBarDropdown,
} from "@frontend/utils/constants";
import { parseAsString, useQueryStates } from "nuqs";
import { useEffect, useRef } from "react";

const validFilterQueries: Partial<Record<FilterKey, string[]>> =
  Object.fromEntries(
    [...filterBarDropdown, ...bookingsFilterDropdown].map(({ key, items }) => [
      key,
      items.map((item) => item.value),
    ]),
  );

const filterQueries = Object.keys(validFilterQueries) as FilterKey[];

const useQueryFilter = () => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);

  const initialLoad = useRef(true);

  const [filterParams, setFilterParams] = useQueryStates(
    {
      capacity: parseAsString.withDefault(""),
      usage: parseAsString.withDefault(""),
      location: parseAsString.withDefault(""),
      duration: parseAsString.withDefault(""),
      recurring: parseAsString.withDefault(""),
      id: parseAsString.withDefault(""),
      bookingType: parseAsString.withDefault(""),
      plannedSize: parseAsString.withDefault(""),
    },
    { shallow: true },
  );

  // Apply filters from URL on load
  useEffect(() => {
    const invalidKeys: Partial<Record<FilterKey, null>> = {};

    filterQueries.forEach((key) => {
      const value = filterParams[key];

      if (!value) return;

      const allowed = validFilterQueries[key] ?? [];

      if (isMultiFilterKey(key)) {
        const values = value.split(",");

        if (values.every((v) => allowed.includes(v))) {
          dispatch(
            setFilter({
              key,
              value: [...new Set(values)],
            }),
          );
        } else {
          invalidKeys[key] = null;
        }
      } else if (allowed.includes(value)) {
        dispatch(setFilter({ key, value }));
      } else {
        invalidKeys[key] = null;
      }
    });

    if (Object.keys(invalidKeys).length > 0) {
      void setFilterParams(invalidKeys);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Apply filters from Redux to URL
  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    const params: Partial<Record<FilterKey, string | null>> = {};

    filterQueries.forEach((key) => {
      const value = filters[key];

      params[key] = Array.isArray(value)
        ? value.join(",") || null
        : (value ?? null);
    });

    void setFilterParams(params);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);
};

export default useQueryFilter;
