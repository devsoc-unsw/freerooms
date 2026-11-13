import { DropDownItem } from "@frontend/types";
import { sortBarDropdown } from "@frontend/utils/constants";
import { parseAsString, useQueryState } from "nuqs";
import { useEffect } from "react";

const useQuerySort = (
  options: DropDownItem[] = sortBarDropdown
): [string, (sort: string) => void] => {
  const [sort, setSort] = useQueryState(
    "sort",
    parseAsString.withDefault("alphabetical")
  );

  useEffect(() => {
    if (sort && !options.some((option) => option.value === sort)) {
      // Null resets the sort to the default value, which is "alphabetical"
      setSort(null);
    }
  }, [sort, options, setSort]);

  return [sort, setSort];
};

export default useQuerySort;
