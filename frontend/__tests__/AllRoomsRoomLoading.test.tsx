import "@testing-library/jest-dom";

import { createTheme, ThemeProvider } from "@mui/material";
import { render } from "@testing-library/react";
import React from "react";

import Room from "../components/AllRoomsRoom";
import RoomList from "../components/AllRoomsRoomList";

jest.mock("../components/AllRoomsSearchBar", () => ({
  __esModule: true,
  default: () => <div data-testid="search-bar" />,
}));

const withTheme = (ui: React.ReactElement) => (
  <ThemeProvider theme={createTheme({})}>{ui}</ThemeProvider>
);

describe("AllRoomsRoom loading state", () => {
  it("renders skeletons and no room name while loading", () => {
    const { container } = render(withTheme(<Room loading />));

    expect(
      container.querySelectorAll(".MuiSkeleton-root").length
    ).toBeGreaterThan(0);
    expect(container.textContent).not.toContain("Ainsworth G03");
  });

  it("renders the room name and no skeletons once loaded", () => {
    const { container } = render(
      withTheme(
        <Room
          name="Ainsworth G03"
          roomNumber="5"
          status="free"
          endtime={new Date().toISOString()}
        />
      )
    );

    expect(container.querySelectorAll(".MuiSkeleton-root").length).toBe(0);
    expect(container.textContent).toContain("Ainsworth G03");
  });
});

describe("AllRoomsRoomList", () => {
  it("renders the search bar and its children", () => {
    const { getByTestId, getByText } = render(
      <RoomList>
        <div>real room list</div>
      </RoomList>
    );

    expect(getByTestId("search-bar")).toBeInTheDocument();
    expect(getByText("real room list")).toBeInTheDocument();
  });
});
