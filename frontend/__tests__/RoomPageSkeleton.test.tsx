import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import RoomPageSkeleton from "components/skeletons/RoomPageSkeleton";

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

  it("renders a circular placeholder for the favourite icon, day navigation and rating circles", () => {
    const { container } = render(<RoomPageSkeleton />);

    const circularSkeletons = container.querySelectorAll(".MuiSkeleton-circular");
    expect(circularSkeletons.length).toBe(6);
  });

  it("renders a rounded placeholder for the photo carousel", () => {
    const { container } = render(<RoomPageSkeleton />);

    const roundedSkeletons = container.querySelectorAll(".MuiSkeleton-rounded");
    expect(roundedSkeletons.length).toBeGreaterThan(0);
  });
});
