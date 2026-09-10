import "@testing-library/jest-dom";

import React from "react";

import Room from "../components/AllRoomsRoom";
import RoomList from "../components/AllRoomsRoomList";
import { renderWithTheme } from "./utils/renderWithRedux";

jest.mock("../components/AllRoomsSearchBar", () => ({
  __esModule: true,
  default: () => <div data-testid="search-bar" />,
}));

describe("AllRoomsRoom loading state", () => {
  it("renders skeletons and no room name while loading", () => {
    const { container } = renderWithTheme(<Room loading />);

    expect(
      container.querySelectorAll(".MuiSkeleton-root").length
    ).toBeGreaterThan(0);
    expect(container.textContent).not.toContain("Ainsworth G03");
  });

  it("renders the room name and no skeletons once loaded", () => {
    const { container } = renderWithTheme(
      <Room
        name="Ainsworth G03"
        roomNumber="5"
        status="free"
        endtime={new Date().toISOString()}
      />
    );

    expect(container.querySelectorAll(".MuiSkeleton-root").length).toBe(0);
    expect(container.textContent).toContain("Ainsworth G03");
  });
});

describe("AllRoomsRoomList", () => {
  it("renders the search bar and its children", () => {
    const { getByTestId, getByText } = renderWithTheme(
      <RoomList>
        <div>real room list</div>
      </RoomList>
    );

    expect(getByTestId("search-bar")).toBeInTheDocument();
    expect(getByText("real room list")).toBeInTheDocument();
  });
});
