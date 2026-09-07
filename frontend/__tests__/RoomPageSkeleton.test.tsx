import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import RoomPageSkeleton from "components/skeletons/RoomPageSkeleton";
import React from "react";

import Page from "../app/room/[room]/page";

const mockUseRoom = jest.fn();
const mockUseBuilding = jest.fn();

jest.mock("next/navigation", () => ({
  useParams: () => ({ room: "K-J17-101" }),
}));
jest.mock("../hooks/useRoom", () => ({
  __esModule: true,
  default: () => mockUseRoom(),
}));
jest.mock("../hooks/useBuilding", () => ({
  __esModule: true,
  default: () => mockUseBuilding(),
}));
jest.mock("../components/BookingCalendar", () => ({
  __esModule: true,
  default: () => <div data-testid="calendar" />,
}));
jest.mock("../components/RoomUtilityTags", () => ({
  __esModule: true,
  default: () => <div />,
}));
jest.mock("../components/Rating/RoomRating", () => ({
  __esModule: true,
  default: () => <div />,
}));
jest.mock("../components/BookingButton", () => ({
  __esModule: true,
  default: () => <div />,
}));
jest.mock("../components/ViewOnMapButton", () => ({
  __esModule: true,
  default: () => <div />,
}));
jest.mock("../components/RoomBackButton", () => ({
  __esModule: true,
  default: () => <div />,
}));

describe("RoomPageSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<RoomPageSkeleton />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders placeholders for every section of the room page", () => {
    const { container } = render(<RoomPageSkeleton />);

    const skeletons = container.querySelectorAll(".MuiSkeleton-root");
    // header, photo, booking calendar, utility tags and ratings sections
    expect(skeletons.length).toBeGreaterThan(20);
  });

  it("renders circular placeholders for the favourite icon and the three rating circles", () => {
    const { container } = render(<RoomPageSkeleton />);

    const circularSkeletons = container.querySelectorAll(
      ".MuiSkeleton-circular"
    );
    // favourite icon (1) + Cleanliness / Location / Quietness circles (3)
    expect(circularSkeletons.length).toBe(4);
  });

  it("renders a rounded placeholder for the photo carousel", () => {
    const { container } = render(<RoomPageSkeleton />);

    const roundedSkeletons = container.querySelectorAll(".MuiSkeleton-rounded");
    expect(roundedSkeletons.length).toBeGreaterThan(0);
  });

  it("keeps both the circular and linear rating placeholders mounted for either breakpoint", () => {
    const { container } = render(<RoomPageSkeleton />);

    // >= 970px layout: three rating circles     
    const ratingCircles = Array.from(
      container.querySelectorAll<HTMLElement>(".MuiSkeleton-circular")
    ).filter((el) => el.style.width === "100px");
    expect(ratingCircles).toHaveLength(3);

    // < 970px layout: three linear rating bars 
    const textSkeletons = Array.from(
      container.querySelectorAll<HTMLElement>(".MuiSkeleton-text")
    );
    expect(textSkeletons.filter((el) => el.style.width === "20%")).toHaveLength(
      3
    );
    expect(
      textSkeletons.filter((el) => el.style.width === "100%")
    ).toHaveLength(3);
  });

  it("is shown until the room and building load, then disappears", () => {
    mockUseRoom.mockReturnValue({ room: undefined });
    mockUseBuilding.mockReturnValue({ building: undefined });

    const { container, rerender, queryByText, getByText } = render(<Page />);

    // loading = skeleton 
    expect(
      container.querySelectorAll(".MuiSkeleton-root").length
    ).toBeGreaterThan(20);
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

    // loaded = no skeleton 
    expect(container.querySelectorAll(".MuiSkeleton-root").length).toBe(0);
    expect(getByText("Ainsworth 101")).toBeInTheDocument();
  });
});
