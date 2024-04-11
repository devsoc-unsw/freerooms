import "@testing-library/jest-dom";

import { Booking } from "@common/types";
import IconButton from "@mui/material/IconButton";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import BookingCalendar from "../components/BookingCalendar";
import store from "../redux/store";

describe("Booking Calendar", () => {
  // test prop for booking calendar
  const start: Date = new Date();
  const end: Date = new Date();
  const events: Booking[] = [
    {
      name: "MARK5827 TUT",
      bookingType: "(CLASS)",
      start: start,
      end: end,
    },
  ];

  it("renders the Room Bookings", () => {
    render(
      <Provider store={store}>
        <BookingCalendar events={events} />
      </Provider>
    );

    const heading = screen.getByText("Room Bookings");

    expect(heading).toBeInTheDocument();
  });

  it("renders the icon button (default test mobile tablet)", () => {
    const { getByRole } = render(
      <Provider store={store}>
        <IconButton></IconButton>
      </Provider>
    );

    const iconButton = getByRole("button");

    expect(iconButton).toBeInTheDocument();
  });

  it("renders the calendar", () => {
    const { queryByTestId } = render(
      <Provider store={store}>
        <BookingCalendar events={events} />
      </Provider>
    );

    const calendar = queryByTestId("calendarContainer");

    expect(calendar).toBeInTheDocument();
  });

  it("does not render icon buttons in desktop view", () => {
    // Mock the window.matchMedia method to simulate desktop view
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === "(min-width: 769px)",
        addListener: jest.fn(),
        removeListener: jest.fn(),
      })),
    });

    render(
      <Provider store={store}>
        <BookingCalendar events={events} />
      </Provider>
    );
    const { queryByTestId } = render(
      <IconButton onClick={() => {}}></IconButton>
    );
    const beforeButton = queryByTestId("beforeButton");
    const nextButton = queryByTestId("nextButton");

    // Check if the component is not rendered in desktop view
    expect(beforeButton).not.toBeInTheDocument();
    expect(nextButton).not.toBeInTheDocument();
  });
});
