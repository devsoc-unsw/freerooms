import useRoomSearch from "@frontend/hooks/rooms/useRoomSearch";
import { renderHook } from "@testing-library/react";
import type { Building, Room } from "common/types";

const buildings: Building[] = [
  {
    id: "K-J17",
    name: "Ainsworth Building",
    lat: 0,
    long: 0,
    aliases: ["Ainsworth"],
  },
  { id: "K-E26", name: "Biological Sciences", lat: 0, long: 0, aliases: [] },
];

const rooms: Room[] = [
  {
    id: "K-J17-101",
    name: "Ainsworth 101",
    abbr: "AINS101",
    capacity: 30,
    usage: "TUSM",
    school: " ",
  },
  {
    id: "K-E26-201",
    name: "BiologicalSci TeachLab",
    abbr: "BIOS201",
    capacity: 80,
    usage: "LAB",
    school: " ",
  },
];

const search = (query: string) =>
  renderHook(() => useRoomSearch(rooms, buildings)).result.current(query);

describe("useRoomSearch", () => {
  it("has nothing to filter by for an empty query", () => {
    expect(search("")).toBeUndefined();
    expect(search("   ")).toBeUndefined();
  });

  it("matches by room name", () => {
    const matches = search("TeachLab");
    expect(matches?.has("K-E26-201")).toBe(true);
    expect(matches?.has("K-J17-101")).toBe(false);
  });

  it("matches by building name", () => {
    expect(search("Biological Sciences")?.has("K-E26-201")).toBe(true);
  });

  it("matches by room type", () => {
    expect(search("Tutorial")?.has("K-J17-101")).toBe(true);
  });

  it("tolerates typos", () => {
    expect(search("Ainswort")?.has("K-J17-101")).toBe(true);
  });
});
