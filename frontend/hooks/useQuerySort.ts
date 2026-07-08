import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

// Function to handle query string parameters for sorting in page.tsx (browse page)
const useQuerySort = (): [string, (sort: string) => void] => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const initialLoad = useRef(true);

    // On initial load, fallback to alphabetical sort if no sort query parameter provided
    const [sort, setSort] = useState<string>(
      () => searchParams.get("sort") ?? "alphabetical"
    );

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
    }, [sort]); // Update query parameters whenever sort changes

    return [sort, setSort];
};

export default useQuerySort;