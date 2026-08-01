import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { sortBarDropdown } from "../utils/constants";

const validSortQueries: string[] = sortBarDropdown.map((item) => item.value);

const isValidSort = (value: string): boolean => {
  return validSortQueries.includes(value);
};

// Function to handle query string parameters for sorting in page.tsx (browse page)
const useQuerySort = (): [string, (sort: string) => void] => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const initialLoad = useRef(true);

  // On initial load, fallback to alphabetical sort if no sort query parameter provided
  const [sort, setSort] = useState<string>(() => {
    const value = searchParams.get("sort");
    return value && isValidSort(value) ? value : "alphabetical";
  });

  // Apply sort to URL when sort changes
  useEffect(() => {
    // Skip first run to avoid overwriting query parameters on initial load with empty state
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);

    // Update the URL with new query parameters
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [sort, pathname, router, searchParams]); // Update query parameters whenever sort changes

  return [sort, setSort];
};

export default useQuerySort;
