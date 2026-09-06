import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";

import { sortBarDropdown } from "../utils/constants";

const validSortQueries: string[] = sortBarDropdown.map((item) => item.value);

const isValidSort = (value: string): boolean =>
  validSortQueries.includes(value);

const useQuerySort = (): [string, (sort: string) => void] => {
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsString.withDefault("alphabetical")
  );

  useEffect(() => {
    if (sort && !isValidSort(sort)) {
      // Null resets the sort to the default value, which is "alphabetical"
      setSort(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [sort, setSort];
};

export default useQuerySort;
