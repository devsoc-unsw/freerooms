import { Building, Room, StatusResponse } from "@common/types";
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
];
const free = { status: "free" as const, endtime: "" };
const status: StatusResponse = {
  "K-J17": { numAvailable: 1, roomStatuses: { "202": free } },
  "K-F8": { numAvailable: 1, roomStatuses: { "102": free } },
};
const rooms: { [id: string]: Room } = {
  "K-J17-202": {
    id: "K-J17-202",
    name: "Computer Lab",
    abbr: "CSELAB",
    capacity: 20,
    usage: "LAB",
    school: "Engineering",
  },
};

const search = (query: string) => {
  const { result } = renderHook(() =>
    useBuildingSearch(buildings, status, rooms)
  );
  const ids = result.current(query);
  return ids && [...ids];
};

describe("useBuildingSearch", () => {
  it("does not filter on an empty query", () => {
    expect(search("  ")).toBeUndefined();
  });
  it("matches building name, code and alias", () => {
    expect(search("mathews")).toEqual(["K-F8"]);
    expect(search("K-J17")).toEqual(["K-J17"]);
    expect(search("ainswth")).toEqual(["K-J17"]);
  });
  it("matches room name and abbreviation", () => {
    expect(search("computer lab")).toEqual(["K-J17"]);
    expect(search("cselab")).toEqual(["K-J17"]);
  });
  it("tolerates typos", () => {
    expect(search("ainswroth")).toEqual(["K-J17"]);
  });
  it("returns nothing for unrelated queries", () => {
    expect(search("quadrangle")).toEqual([]);
  });
});
