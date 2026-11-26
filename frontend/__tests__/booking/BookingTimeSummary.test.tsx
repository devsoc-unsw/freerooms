import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import BookingTimeSummary from "@frontend/components/booking/BookingTimeSummary";
import { act, screen } from "@testing-library/react";

const booking = {
  start: new Date("2026-01-04T22:00:00Z"),
  end: new Date("2026-01-05T00:00:00Z"),
};

describe("BookingTimeSummary", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("displays the Sydney date and time", () => {
    jest.setSystemTime(new Date("2026-01-04T20:36:00Z"));

    render(<BookingTimeSummary booking={booking} />);

    expect(screen.getByText("Monday, 5 January 2026")).toBeInTheDocument();

    expect(screen.getByText("9:00 am – 11:00 am")).toBeInTheDocument();
  });

  it("displays upcoming status without a progress bar", () => {
    jest.setSystemTime(new Date("2026-01-04T20:36:00Z"));

    render(<BookingTimeSummary booking={booking} />);

    expect(screen.getByText("Starts in 1 hour 24 minutes")).toBeInTheDocument();

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("displays progress for an ongoing booking", () => {
    jest.setSystemTime(new Date("2026-01-04T23:18:00Z"));

    render(<BookingTimeSummary booking={booking} />);

    expect(screen.getByText("42 minutes remaining")).toBeInTheDocument();

    expect(
      screen.getByRole("progressbar", {
        name: "Booking progress",
      })
    ).toHaveAttribute("aria-valuenow", "65");
  });

  it("hides progress for completed bookings", () => {
    jest.setSystemTime(new Date("2026-01-05T02:00:00Z"));

    render(<BookingTimeSummary booking={booking} />);

    expect(screen.getByText("Ended 2 hours ago")).toBeInTheDocument();

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });

  it("automatically updates the remaining time", () => {
    jest.setSystemTime(new Date("2026-01-04T23:18:00Z"));

    render(<BookingTimeSummary booking={booking} />);

    expect(screen.getByText("42 minutes remaining")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(60_000);
    });

    expect(screen.getByText("41 minutes remaining")).toBeInTheDocument();
  });

  it("automatically transitions to completed", () => {
    jest.setSystemTime(new Date("2026-01-04T23:59:00Z"));

    render(<BookingTimeSummary booking={booking} />);

    expect(screen.getByText("1 minute remaining")).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(60_000);
    });

    expect(screen.getByText("Ended just now")).toBeInTheDocument();

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
