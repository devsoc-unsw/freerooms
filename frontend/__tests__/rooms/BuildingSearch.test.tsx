import { Building, Room } from "@common/types";
import useBuildingSearch from "@frontend/hooks/buildings/useBuildingSearch";
import { renderHook } from "@testing-library/react";

const building = (
  id: string,
  name: string,
  aliases: string[] = []
): Building => ({
  id,
  name,
  lat: 0,
  long: 0,
  aliases,
});
const buildings = [
  building("K-J17", "Ainsworth Building", ["Ainswth"]),
  building("K-F8", "Mathews Building"),
  // Its code is a prefix of K-J17, so its rooms must not be mixed up
  building("K-J1", "Old Annex"),
];
const room = (
  id: string,
  name: string,
  abbr: string,
  school: string
): Room => ({
  id,
  name,
  abbr,
  capacity: 20,
  usage: "LAB",
  school,
});
const rooms: { [id: string]: Room } = {
  "K-J17-202": room("K-J17-202", "Computer Lab", "CSELAB", "COMPSC"),
  "K-F8-102": room("K-F8-102", "Mathews 102", "MATH102", " "),
};

const search = (query: string) => {
  const { result } = renderHook(() => useBuildingSearch(buildings, rooms));
  const ids = result.current(query);
  return ids && [...ids];
};

describe("useBuildingSearch", () => {
  it("does not filter on an empty query", () => {
    expect(search("  ")).toBeUndefined();
  });
  it("does not filter until buildings have loaded", () => {
    const { result } = renderHook(() => useBuildingSearch(undefined, rooms));
    expect(result.current("ainsworth")).toBeUndefined();
  });
  it("matches building name, code and alias", () => {
    expect(search("mathews")).toEqual(["K-F8"]);
    expect(search("K-J17")).toContain("K-J17"); // may also match a near code
    expect(search("ainswth")).toEqual(["K-J17"]);
  });
  it("matches room name, abbreviation and school", () => {
    expect(search("computer lab")).toEqual(["K-J17"]);
    expect(search("cselab")).toEqual(["K-J17"]);
    expect(search("compsc")).toEqual(["K-J17"]);
  });
  it("does not give a room to a building with a similar code", () => {
    expect(search("K-J17-202")).toEqual(["K-J17"]);
  });
  it("still matches buildings before rooms have loaded", () => {
    const { result } = renderHook(() =>
      useBuildingSearch(buildings, undefined)
    );
    expect(result.current("mathews")).toEqual(new Set(["K-F8"]));
  });
  it("tolerates typos", () => {
    expect(search("ainswroth")).toEqual(["K-J17"]);
    expect(search("compsk")).toEqual(["K-J17"]);
  });
  it("returns nothing for unrelated queries", () => {
    expect(search("quadrangle")).toEqual([]);
  });
  it("keeps the same search function between renders", () => {
    const { result, rerender } = renderHook(() =>
      useBuildingSearch(buildings, rooms)
    );
    const first = result.current;
    rerender();
    expect(result.current).toBe(first);
  });
});
