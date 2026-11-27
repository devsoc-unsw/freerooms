import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import RoomAvailability from "@frontend/components/rooms/RoomAvailability";
import RoomCard from "@frontend/components/rooms/RoomCard";
import { fireEvent, screen } from "@testing-library/react";
import type { Room } from "common/types";

const mockUseRoomStatus = jest.fn();
const mockUseNearbyBookings = jest.fn();

jest.mock("@frontend/hooks/rooms/useRoomStatus", () => ({
  __esModule: true,
  default: () => mockUseRoomStatus(),
}));

jest.mock("@frontend/hooks/bookings/useNearbyBookings", () => ({
  __esModule: true,
  default: () => mockUseNearbyBookings(),
}));

jest.mock("@frontend/hooks/buildings/useBuilding", () => ({
  __esModule: true,
  default: () => ({
    building: { id: "K-J17", name: "Ainsworth Building" },
  }),
}));

jest.mock("@frontend/hooks/ratings/useRoomRatings", () => ({
  __esModule: true,
  default: () => ({ data: { overallRating: 4 } }),
}));

jest.mock("@frontend/components/rooms/RoomUtilityTags", () => ({
  __esModule: true,
  default: () => <div data-testid="utility-tags" />,
}));

const endtime = "2026-11-06T15:00:00+11:00";
const time = "\\d{1,2}:\\d{2}(am|pm)";

const room: Room = {
  id: "K-J17-101",
  name: "Ainsworth 101",
  abbr: "AINS101",
  capacity: 30,
  usage: "TUSM",
  school: " ",
};

describe("RoomCard", () => {
  beforeEach(() => {
    window.localStorage.clear();

    mockUseRoomStatus.mockReturnValue({
      status: { status: "free", endtime },
    });

    mockUseNearbyBookings.mockReturnValue({
      current: undefined,
      nextLaterThatDay: undefined,
    });
  });

  describe("Room details", () => {
    it("shows the room's name, location and details", () => {
      render(<RoomCard room={room} />);

      expect(screen.getByText("Ainsworth 101")).toBeInTheDocument();
      expect(
        screen.getByText("Lower campus, Ainsworth Building")
      ).toBeInTheDocument();
      expect(screen.getByText("30")).toBeInTheDocument();
      expect(screen.getByText("Tutorial Room")).toBeInTheDocument();
      expect(screen.getByText("ID Not Required")).toBeInTheDocument();
      expect(screen.getByText("4")).toBeInTheDocument();
    });

    it("links to the room in the same tab", () => {
      render(<RoomCard room={room} />);

      const link = screen.getByRole("link");

      expect(link).toHaveAttribute("href", "/room/K-J17-101");
      expect(link).not.toHaveAttribute("target");
    });
  });

  describe("Room availability", () => {
    it("keeps the stacked list layout by default", () => {
      render(<RoomAvailability roomStatus={{ status: "soon", endtime }} />);

      expect(screen.getByText("Available Soon")).toBeInTheDocument();
    });

    describe("Pill variant", () => {
      it("shows 'Available until <time>' for a free room", () => {
        render(
          <RoomAvailability
            roomStatus={{ status: "free", endtime }}
            variant="pill"
          />
        );

        expect(
          screen.getByText(new RegExp(`^Available until ${time}$`))
        ).toBeInTheDocument();
      });

      it("adds the booking name for a busy room", () => {
        render(
          <RoomAvailability
            roomStatus={{ status: "busy", endtime }}
            variant="pill"
            reason="COMP1511 Lab"
          />
        );

        expect(
          screen.getByText(
            new RegExp(`^Unavailable until ${time} - COMP1511 Lab$`)
          )
        ).toBeInTheDocument();
      });

      it("shows a soon room as 'Available Soon'", () => {
        render(
          <RoomAvailability
            roomStatus={{ status: "soon", endtime }}
            variant="pill"
          />
        );

        expect(
          screen.getByText(new RegExp(`^Available Soon at ${time}$`))
        ).toBeInTheDocument();
      });

      it("uses the next booking as the end of a free room with no end time", () => {
        render(
          <RoomAvailability
            roomStatus={{ status: "free", endtime: "" }}
            variant="pill"
            until={new Date("2026-11-06T15:30:00+11:00")}
          />
        );

        expect(
          screen.getByText(new RegExp(`^Available until ${time}$`))
        ).toBeInTheDocument();
      });

      it("just says Available when there is no end time and no next booking", () => {
        render(
          <RoomAvailability
            roomStatus={{ status: "free", endtime: "" }}
            variant="pill"
          />
        );

        expect(screen.getByText("Available")).toBeInTheDocument();
      });
    });

    it("shows what is using a busy room", () => {
      mockUseRoomStatus.mockReturnValue({
        status: { status: "busy", endtime },
      });

      mockUseNearbyBookings.mockReturnValue({
        current: { name: "COMP1511 Lab" },
        nextLaterThatDay: undefined,
      });

      render(<RoomCard room={room} />);

      expect(
        screen.getByText(/^Unavailable until .* - COMP1511 Lab$/)
      ).toBeInTheDocument();
    });
  });

  describe("Favourites", () => {
    it("adds and removes the favourite", () => {
      render(<RoomCard room={room} />);

      fireEvent.click(
        screen.getByRole("button", { name: /Add as favourite/i })
      );

      expect(
        JSON.parse(window.localStorage.getItem("favourite") ?? "[]")
      ).toContain("K-J17-101");

      fireEvent.click(
        screen.getByRole("button", { name: /Remove as favourite/i })
      );

      expect(
        JSON.parse(window.localStorage.getItem("favourite") ?? "[]")
      ).not.toContain("K-J17-101");
    });
  });

  describe("Utilities", () => {
    it("only loads the utilities once they are opened", () => {
      render(<RoomCard room={room} />);

      expect(screen.queryByTestId("utility-tags")).not.toBeInTheDocument();

      fireEvent.click(screen.getByText("View all utilities"));

      expect(screen.getByTestId("utility-tags")).toBeInTheDocument();
    });
  });

  describe("Loading state", () => {
    it("shows a skeleton while loading", () => {
      const { container } = render(<RoomCard loading />);

      expect(container.querySelector(".MuiSkeleton-root")).toBeInTheDocument();
    });
  });
});
