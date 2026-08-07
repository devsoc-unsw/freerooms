import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import React from "react";

import RoomAvailabilityBox from "../views/RoomAvailabilityBox";

jest.mock("../public/room-photos.json", () => ({
  "K-G14-334": [
    "https://example.com/room-photo-1.jpg",
    "https://example.com/room-photo-2.jpg",
  ],
}));

const roomStatus = {
  status: "soon" as const, 
  endtime: new Date().toISOString()
}

describe("RoomAvailabilityBox", () => {
  test('renders "Available Soon" without wrapping', () => {
    // Mock roomStatus representing "available soon" status
    const roomStatus = {
      status: "soon" as const,
      endtime: new Date().toISOString(),
    };

    // Render RoomAvailabilityBox with mock data
    render(
      <RoomAvailabilityBox
        roomNumber="334"
        buildingId="K-G14"
        roomStatus={roomStatus}
      />
    );

    const availableSoonText = screen.getByText(/available soon/i);
    expect(availableSoonText).toBeInTheDocument();
    // check if there is wrapping of the text, if offsetWidth < scrollWidth,
    // then there is wrapping involved because the total width of the content
    // is overflowing (i.e. some of the content is not visible)
    const isWrapping =
      availableSoonText.offsetWidth < availableSoonText.scrollWidth;
    expect(isWrapping).toBe(false);
  });

  test("uses the first room photo as the background image when photos exist", () => {
    render(
      <RoomAvailabilityBox
        roomNumber="334"
        buildingId="K-G14"
        roomStatus={roomStatus}
      />
    );

    const box = screen.getByRole("link").firstElementChild as HTMLElement
    const backgroundImage = getComputedStyle(box).getPropertyValue("background-image");

    expect(backgroundImage).toContain(
      "https://example.com/room-photo-1.jpg"
    );
  });

  test("room box background image defaults to building if it has no photos", () => {

    render(
      <RoomAvailabilityBox
        roomNumber="888"
        buildingId="K-G14"
        roomStatus={roomStatus}
      />
    );

    const box = screen.getByRole("link").firstElementChild as HTMLElement
    const backgroundImage = getComputedStyle(box).getPropertyValue("background-image");

    expect(backgroundImage).toContain('/assets/building_photos/K-G14.webp');
  })
});
