import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import AllRoomsRoomListSkeleton from "components/skeletons/AllRoomsRoomListSkeleton";

describe("AllRoomsRoomListSkeleton", () => {
  
  const NUM_PLACEHOLDER_ROOM_SKELETONS = 5

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
});
