import useNearbyBookings from "@frontend/hooks/bookings/useNearbyBookings";
import { setDatetime } from "@frontend/redux/slices/datetimeSlice";
import store from "@frontend/redux/store";
import { renderHook } from "@testing-library/react";
import type { Booking } from "common/types";
import type { ReactNode } from "react";
import { Provider } from "react-redux";

// Relates to the availability pill that appears on room cards (reasoning for unavailability)

const mockUseBookings = jest.fn();
jest.mock("@frontend/hooks/bookings/useBookings", () => ({
  __esModule: true,
  default: (roomId: string | undefined) => mockUseBookings(roomId),
}));

const at = (day: number, hour: number) =>
  new Date(Date.UTC(2026, 5, day, hour - 10));

const booking = (name: string, start: Date, end: Date) =>
  ({ name, start, end }) as Booking;

const wrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

const renderNearby = (enabled = true) =>
  renderHook(() => useNearbyBookings("K-J17-101", enabled), { wrapper }).result
    .current;

describe("useNearbyBookings", () => {
  beforeEach(() => {
    store.dispatch(setDatetime(at(15, 10)));
    mockUseBookings.mockReturnValue({ bookings: undefined });
  });

  it("finds nothing until the bookings load", () => {
    expect(renderNearby()).toEqual({
      current: undefined,
      nextLaterThatDay: undefined,
    });
  });

  it("returns the booking that is on now", () => {
    const now = booking("COMP1511 Lab", at(15, 9), at(15, 11));
    mockUseBookings.mockReturnValue({
      bookings: [booking("Earlier", at(15, 7), at(15, 8)), now],
    });

    expect(renderNearby().current).toBe(now);
  });

  it("does not count a booking that has just ended", () => {
    mockUseBookings.mockReturnValue({
      bookings: [booking("Ended", at(15, 9), at(15, 10))],
    });

    expect(renderNearby().current).toBeUndefined();
  });

  it("returns the earliest booking starting later that day", () => {
    const first = booking("First", at(15, 12), at(15, 13));
    mockUseBookings.mockReturnValue({
      bookings: [booking("Second", at(15, 14), at(15, 15)), first],
    });

    expect(renderNearby().nextLaterThatDay).toBe(first);
  });

  it("ignores bookings that start on another day", () => {
    mockUseBookings.mockReturnValue({
      bookings: [booking("Tomorrow", at(16, 9), at(16, 10))],
    });

    expect(renderNearby().nextLaterThatDay).toBeUndefined();
  });

  it("only asks for bookings when enabled", () => {
    renderNearby(false);
    expect(mockUseBookings).toHaveBeenLastCalledWith(undefined);

    renderNearby(true);
    expect(mockUseBookings).toHaveBeenLastCalledWith("K-J17-101");
  });
});
