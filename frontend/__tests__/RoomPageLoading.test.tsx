import "@testing-library/jest-dom";

import { renderWithTheme } from "@frontend/__tests__/utils/renderWithRedux";
import Page from "@frontend/app/room/[room]/page";
import React from "react";

const mockUseRoom = jest.fn();
const mockUseBuilding = jest.fn();

jest.mock("next/navigation", () => ({
  useParams: () => ({ room: "K-J17-101" }),
}));
jest.mock("@frontend/hooks/useRoom", () => ({
  __esModule: true,
  default: () => mockUseRoom(),
}));
jest.mock("@frontend/hooks/useBuilding", () => ({
  __esModule: true,
  default: () => mockUseBuilding(),
}));
jest.mock("@frontend/components/booking/BookingCalendar", () => ({
  __esModule: true,
  default: () => <div data-testid="calendar" />,
}));
jest.mock("@frontend/components/rooms/RoomUtilityTags", () => ({
  __esModule: true,
  default: () => <div />,
}));
jest.mock("@frontend/components/ratings/RoomRating", () => ({
  __esModule: true,
  default: () => <div />,
}));
jest.mock("@frontend/components/booking/BookingButton", () => ({
  __esModule: true,
  default: () => <div />,
}));
jest.mock("@frontend/components/navigation/ViewOnMapButton", () => ({
  __esModule: true,
  default: () => <div />,
}));
jest.mock("@frontend/components/navigation/RoomBackButton", () => ({
  __esModule: true,
  default: () => <div />,
}));

describe("Room page loading state", () => {
  it("shows section skeletons until the room and building load, then the real content", () => {
    mockUseRoom.mockReturnValue({ room: undefined });
    mockUseBuilding.mockReturnValue({ building: undefined });

    const { container, rerender, queryByText, getByText } = renderWithTheme(
      <Page />
    );

    // loading = one placeholder per section, no room name yet
    expect(
      container.querySelectorAll(".MuiSkeleton-root").length
    ).toBeGreaterThan(0);
    expect(queryByText("Ainsworth 101")).not.toBeInTheDocument();

    mockUseRoom.mockReturnValue({
      room: {
        id: "K-J17-101",
        name: "Ainsworth 101",
        usage: "TUT",
        capacity: 30,
        abbr: "AINS101",
        school: " ",
      },
    });
    mockUseBuilding.mockReturnValue({
      building: { id: "K-J17", name: "Ainsworth" },
    });
    rerender(<Page />);

    // loaded = skeletons gone, real content shown
    expect(container.querySelectorAll(".MuiSkeleton-root").length).toBe(0);
    expect(getByText("Ainsworth 101")).toBeInTheDocument();
  });
});
