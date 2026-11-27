import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import RelatedBookings from "@frontend/components/booking/RelatedBookings";
import { fireEvent, screen } from "@testing-library/react";
import type { BookingsEventResponse } from "common/types";

const makeBooking = (
  occurrenceId: string,
  day: number,
): BookingsEventResponse => ({
  roomId: "K-F17-LG3",
  occurrenceId,
  eventId: "event-1",
  name: "COMP2521 LEC",
  bookingType: "LECTURE",
  plannedSize: 250,
  start: new Date(Date.UTC(2026, 0, day, 0)),
  end: new Date(Date.UTC(2026, 0, day, 2)),
});

const currentBooking = makeBooking("current", 1);
const previous = makeBooking("previous", 5);
const upcoming = makeBooking("upcoming", 20);

describe("RelatedBookings", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-01-15T00:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("defaults to upcoming sessions when available", () => {
    render(
      <RelatedBookings
        booking={currentBooking}
        bookings={[currentBooking, previous, upcoming]}
      />,
    );

    expect(screen.getByRole("button", { name: "Upcoming" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    expect(screen.getAllByRole("link")).toHaveLength(1);

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/booking/K-F17-LG3/upcoming",
    );
  });

  it("defaults to previous when no upcoming sessions exist", () => {
    render(
      <RelatedBookings
        booking={currentBooking}
        bookings={[currentBooking, previous]}
      />,
    );

    expect(screen.getByRole("button", { name: "Previous" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("allows switching between filters", () => {
    render(
      <RelatedBookings
        booking={currentBooking}
        bookings={[currentBooking, previous, upcoming]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Previous" }));

    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/booking/K-F17-LG3/previous",
    );

    fireEvent.click(screen.getByRole("button", { name: "All" }));

    expect(screen.getAllByRole("link")).toHaveLength(2);
  });

  it("hides the section when only the current booking exists", () => {
    render(
      <RelatedBookings booking={currentBooking} bookings={[currentBooking]} />,
    );

    expect(
      screen.queryByRole("heading", {
        name: "Related sessions",
      }),
    ).not.toBeInTheDocument();
  });

  it("shows an empty message for a filter without sessions", () => {
    render(
      <RelatedBookings
        booking={currentBooking}
        bookings={[currentBooking, previous]}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Upcoming" }));

    expect(screen.getByText("No upcoming sessions")).toBeInTheDocument();
  });

  it("shows more sessions in groups of five", () => {
    const bookings = Array.from({ length: 12 }, (_, index) =>
      makeBooking(`session-${index}`, index + 16),
    );

    render(
      <RelatedBookings
        booking={currentBooking}
        bookings={[currentBooking, ...bookings]}
      />,
    );

    expect(screen.getAllByRole("link")).toHaveLength(5);

    fireEvent.click(screen.getByRole("button", { name: /show more/i }));

    expect(screen.getAllByRole("link")).toHaveLength(10);

    fireEvent.click(screen.getByRole("button", { name: /show more/i }));

    expect(screen.getAllByRole("link")).toHaveLength(12);

    expect(
      screen.queryByRole("button", { name: /show more/i }),
    ).not.toBeInTheDocument();
  });

  it("resets the visible count when changing filters", () => {
    const bookings = Array.from({ length: 12 }, (_, index) =>
      makeBooking(`session-${index}`, index + 16),
    );

    render(<RelatedBookings booking={currentBooking} bookings={bookings} />);

    fireEvent.click(screen.getByRole("button", { name: /show more/i }));

    expect(screen.getAllByRole("link")).toHaveLength(10);

    fireEvent.click(screen.getByRole("button", { name: "All" }));

    expect(screen.getAllByRole("link")).toHaveLength(5);
  });
});
