import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import NearbyRoomCard from "@frontend/components/rooms/NearbyRoomCard";
import NearbyRoomsCarousel from "@frontend/components/rooms/NearbyRoomsCarousel";
import useNearbyRooms from "@frontend/hooks/rooms/useNearbyRooms";
import type { NearbyRoom } from "@frontend/utils/nearbyRooms";
import { fireEvent, screen } from "@testing-library/react";
import React from "react";

jest.mock("@frontend/hooks/rooms/useNearbyRooms");

jest.mock("swiper/modules", () => ({
  A11y: {},
}));

jest.mock("swiper/react", () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper">{children}</div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="swiper-slide">{children}</div>
  ),
}));

const mockUseNearbyRooms = jest.mocked(useNearbyRooms);

const nearbyRoom: NearbyRoom = {
  room: {
    id: "K-J17-101",
    name: "Ainsworth 101",
    abbr: "AINS101",
    capacity: 30,
    usage: "TUSM",
    school: " ",
  },
  building: {
    id: "K-J17",
    name: "Ainsworth Building",
    lat: -33.917,
    long: 151.231,
    aliases: [],
  },
  status: {
    status: "free",
    endtime: "2026-11-28T15:00:00+11:00",
  },
  distance: 0,
};

beforeEach(() => {
  window.localStorage.clear();

  mockUseNearbyRooms.mockReturnValue({
    nearbyRooms: [nearbyRoom],
    isLoading: false,
    error: undefined,
  });
});

describe("NearbyRoomCard", () => {
  it("displays the room name, location and availability", () => {
    render(<NearbyRoomCard {...nearbyRoom} />);

    expect(screen.getByText("Ainsworth 101")).toBeInTheDocument();

    expect(
      screen.getByText("Lower campus, Ainsworth Building")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/^Available until \d{1,2}:\d{2}(am|pm)$/)
    ).toBeInTheDocument();
  });

  it("links to the correct room in the same tab", () => {
    render(<NearbyRoomCard {...nearbyRoom} />);

    const link = screen.getByRole("link");

    expect(link).toHaveAttribute("href", "/room/K-J17-101");
    expect(link).not.toHaveAttribute("target");
  });

  it("shows availability without inventing an end time", () => {
    render(
      <NearbyRoomCard
        {...nearbyRoom}
        status={{ status: "free", endtime: "" }}
      />
    );

    expect(screen.getByText("Available")).toBeInTheDocument();
  });

  it("shows when an ID is required", () => {
    render(
      <NearbyRoomCard
        {...nearbyRoom}
        room={{ ...nearbyRoom.room, school: "CSE" }}
      />
    );

    expect(screen.getByText("ID Required")).toBeInTheDocument();
  });

  it("adds and removes a favourite", () => {
    render(<NearbyRoomCard {...nearbyRoom} />);

    fireEvent.click(screen.getByRole("button", { name: "Add as favourite" }));

    expect(
      JSON.parse(window.localStorage.getItem("favourite") ?? "[]")
    ).toContain(nearbyRoom.room.id);

    const removeButton = screen.getByRole("button", {
      name: "Remove as favourite",
    });

    expect(removeButton).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(removeButton);

    expect(
      JSON.parse(window.localStorage.getItem("favourite") ?? "[]")
    ).not.toContain(nearbyRoom.room.id);
  });

  it("keeps the favourite button outside the navigation link", () => {
    render(<NearbyRoomCard {...nearbyRoom} />);

    const link = screen.getByRole("link");
    const favourite = screen.getByRole("button", {
      name: "Add as favourite",
    });

    expect(link).not.toContainElement(favourite);
  });
});

describe("NearbyRoomsCarousel", () => {
  it("displays the section heading", () => {
    render(<NearbyRoomsCarousel roomId="K-J17-100" />);

    expect(
      screen.getByRole("heading", {
        name: "Available Rooms Nearby",
      })
    ).toBeInTheDocument();
  });

  it("requests nearby rooms relative to the current room", () => {
    render(<NearbyRoomsCarousel roomId="K-J17-100" />);

    expect(mockUseNearbyRooms).toHaveBeenCalledWith("K-J17-100");
  });

  it("renders one slide per nearby room", () => {
    mockUseNearbyRooms.mockReturnValue({
      nearbyRooms: [
        nearbyRoom,
        {
          ...nearbyRoom,
          room: {
            ...nearbyRoom.room,
            id: "K-J17-102",
            name: "Ainsworth 102",
          },
        },
      ],
      isLoading: false,
      error: undefined,
    });

    render(<NearbyRoomsCarousel roomId="K-J17-100" />);

    expect(screen.getAllByTestId("swiper-slide")).toHaveLength(2);
    expect(screen.getByText("Ainsworth 101")).toBeInTheDocument();
    expect(screen.getByText("Ainsworth 102")).toBeInTheDocument();
  });

  it("shows skeleton cards while loading", () => {
    mockUseNearbyRooms.mockReturnValue({
      nearbyRooms: undefined,
      isLoading: true,
      error: undefined,
    });

    const { container } = render(<NearbyRoomsCarousel roomId="K-J17-100" />);

    expect(container.querySelectorAll(".MuiSkeleton-root")).toHaveLength(5);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("shows an empty state when no rooms are available", () => {
    mockUseNearbyRooms.mockReturnValue({
      nearbyRooms: [],
      isLoading: false,
      error: undefined,
    });

    render(<NearbyRoomsCarousel roomId="K-J17-100" />);

    expect(
      screen.getByText("There are no available nearby rooms right now")
    ).toBeInTheDocument();

    expect(screen.queryByTestId("swiper")).not.toBeInTheDocument();
  });

  it("shows an error state when fetching fails", () => {
    mockUseNearbyRooms.mockReturnValue({
      nearbyRooms: undefined,
      isLoading: false,
      error: new Error("Network error"),
    });

    render(<NearbyRoomsCarousel roomId="K-J17-100" />);

    expect(screen.getByText("Could not load nearby rooms")).toBeInTheDocument();
  });
});
