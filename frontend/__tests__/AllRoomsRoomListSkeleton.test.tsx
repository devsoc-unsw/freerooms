import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import AllRoomsRoomListSkeleton from "components/skeletons/AllRoomsRoomListSkeleton";
import React from "react";

import RoomList from "../components/AllRoomsRoomList";

jest.mock("../components/AllRoomsSearchBar", () => ({
  __esModule: true,
  default: () => <div data-testid="search-bar" />,
}));

describe("AllRoomsRoomListSkeleton", () => {
  const NUM_PLACEHOLDER_ROOM_SKELETONS = 5;

  it("renders a placeholder row for each expected room", () => {
    const { container } = render(<AllRoomsRoomListSkeleton />);

    const skeletons = container.querySelectorAll(".MuiSkeleton-root");

    expect(skeletons.length).toBe(NUM_PLACEHOLDER_ROOM_SKELETONS);
  });

  it("renders rounded placeholder rows", () => {
    const { container } = render(<AllRoomsRoomListSkeleton />);

    const skeletons = container.querySelectorAll(".MuiSkeleton-rounded");

    expect(skeletons.length).toBe(NUM_PLACEHOLDER_ROOM_SKELETONS);
  });

  it("disappears once the room list has loaded", () => {
    const { container, rerender } = render(
      <RoomList isValidating={true}>
        <div>real room list</div>
      </RoomList>
    );

    // still validating = skeleton shows
    expect(container.querySelectorAll(".MuiSkeleton-root").length).toBe(
      NUM_PLACEHOLDER_ROOM_SKELETONS
    );
    expect(container.textContent).not.toContain("real room list");

    rerender(
      <RoomList isValidating={false}>
        <div>real room list</div>
      </RoomList>
    );

    // loaded = skeleton gone
    expect(container.querySelectorAll(".MuiSkeleton-root").length).toBe(0);
    expect(container.textContent).toContain("real room list");
  });
});
