import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
    selectFilters,
    setFilter
} from "redux/filtersSlice";
import { Filters } from "../types";

import { useDispatch, useSelector } from "../redux/hooks";

// Type for the keys of the Filters type
const FilterQuery: (keyof Filters)[] = [
    "capacity",
    "usage",
    "location",
    "duration",
    "id"
];

// Function to handle query string parameters for filters in page.tsx (browse page)
const useFilterQuery = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const filters = useSelector(selectFilters);
    
    // On initial load, apply filters from query parameters to Redux state
    useEffect(() => {
        FilterQuery.forEach((key) => {
            const value = searchParams.get(key);
            if (value) {
                dispatch(setFilter({ key, value }));
            }
        })
    }, []); // Apply filters on initial load (when user shares link with query params), and not on subsequent loads

    // Apply filters from Redux state to URL query parameters when filters change
    useEffect(() => {
        const params = new URLSearchParams();
        FilterQuery.forEach((key) => {
            const value = filters[key];
            if (value) {
                // If the filter value exists, apply to query parameters
                params.set(key, value);
            } else {
                // Remove the key if the filter value is not in the filter
                params.delete(key);
            }
        })
        
        // Update the URL with new query parameters
        router.replace(`/browse?${params.toString()}`);
    }, [filters]) // Update query parameters whenever filters change
}

export default useFilterQuery;