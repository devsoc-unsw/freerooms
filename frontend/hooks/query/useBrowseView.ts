import type { BrowseView } from "@frontend/types";
import { parseAsString, useQueryState } from "nuqs";
import { useCallback } from "react";

const ROOMS = "rooms";

const useBrowseView = (): [BrowseView, (view: BrowseView) => void] => {
  const [param, setParam] = useQueryState(
    "view",
    parseAsString.withDefault(""),
  );

  const view: BrowseView = param === ROOMS ? "rooms" : "buildings";

  const setView = useCallback(
    (next: BrowseView) => setParam(next === "rooms" ? ROOMS : null),
    [setParam],
  );

  return [view, setView];
};

export default useBrowseView;
