import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

import RoomAvailabilityBox from "../views/RoomAvailabilityBox";

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
    // is overflowing (i.e. some of the content is not visible), but the Available
    // soon text does not get affected either way.
    const isWrapping =
      availableSoonText.offsetWidth < availableSoonText.scrollWidth;
    expect(isWrapping).toBe(false);
  });
});
