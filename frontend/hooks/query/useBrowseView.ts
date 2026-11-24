import { useDispatch } from "@frontend/redux/hooks";
import { unsetFilter } from "@frontend/redux/slices/filtersSlice";
import type { BrowseView } from "@frontend/types";
import { parseAsString, useQueryState } from "nuqs";
import { useCallback } from "react";

const ROOMS = "rooms";

const useBrowseView = (): [BrowseView, (view: BrowseView) => void] => {
  const dispatch = useDispatch();
  const [param, setParam] = useQueryState("view", parseAsString.withDefault(""));

  const view: BrowseView = param === ROOMS ? "rooms" : "buildings";

  const setView = useCallback(
    (next: BrowseView) => {
      if (next === "rooms") dispatch(unsetFilter("recurring"));
      setParam(next === "rooms" ? ROOMS : null);
    },
    [dispatch, setParam]
  );

  return [view, setView];
};

export default useBrowseView;
