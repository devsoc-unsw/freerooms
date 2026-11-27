import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import RoomAvailabilityBox from "@frontend/components/rooms/RoomAvailabilityBox";
import toSydneyTime from "@frontend/utils/toSydneyTime";
import { fireEvent, screen } from "@testing-library/react";

jest.mock("@frontend/public/room-photos.json", () => ({
  "K-G14-334": [
    "https://example.com/room-photo-1.jpg",
    "https://example.com/room-photo-2.jpg",
  ],
}));

jest.mock("@frontend/hooks/rooms/useRoomAvailabilityReason", () => ({
  __esModule: true,
  default: () => ({ reason: undefined, until: undefined }),
}));

const roomStatus = {
  status: "soon" as const,
  endtime: toSydneyTime(new Date()).toISOString(),
};

describe("RoomAvailabilityBox", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test('renders "Available Soon" without wrapping', () => {
    // Mock roomStatus representing "available soon" status
    const roomStatus = {
      status: "soon" as const,
      endtime: toSydneyTime(new Date()).toISOString(),
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

    const box = screen.getByRole("link");
    const backgroundImage =
      getComputedStyle(box).getPropertyValue("background-image");

    expect(backgroundImage).toContain("https://example.com/room-photo-1.jpg");
  });

  test("room box background image defaults to building if it has no photos", () => {
    render(
      <RoomAvailabilityBox
        roomNumber="888"
        buildingId="K-G14"
        roomStatus={roomStatus}
      />
    );

    const box = screen.getByRole("link");
    const backgroundImage =
      getComputedStyle(box).getPropertyValue("background-image");

    expect(backgroundImage).toContain("/assets/building_photos/K-G14.webp");
  });

  test("room link includes selected date", () => {
    render(
      <RoomAvailabilityBox
        roomNumber="334"
        buildingId="K-G14"
        roomStatus={roomStatus}
        date="2026-09-11"
      />
    );

    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("href", "/room/K-G14-334?date=2026-09-11");
  });

  test("room link does not include invalid date", () => {
    render(
      <RoomAvailabilityBox
        roomNumber="334"
        buildingId="K-G14"
        roomStatus={roomStatus}
        date="invalid-date"
      />
    );

    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("href", "/room/K-G14-334");
  });

  test("adds and removes the room as a favourite", () => {
    render(
      <RoomAvailabilityBox
        roomNumber="334"
        buildingId="K-G14"
        roomStatus={roomStatus}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /Add as favourite/i }));

    expect(
      JSON.parse(window.localStorage.getItem("favourite") ?? "[]")
    ).toContain("K-G14-334");

    fireEvent.click(
      screen.getByRole("button", { name: /Remove as favourite/i })
    );

    expect(
      JSON.parse(window.localStorage.getItem("favourite") ?? "[]")
    ).not.toContain("K-G14-334");
  });

  test("does not follow the room link when the favourite button is clicked", () => {
    render(
      <RoomAvailabilityBox
        roomNumber="334"
        buildingId="K-G14"
        roomStatus={roomStatus}
      />
    );

    // fireEvent returns false when the click's default action was prevented
    const notPrevented = fireEvent.click(
      screen.getByRole("button", { name: /Add as favourite/i })
    );

    expect(notPrevented).toBe(false);
  });
});
