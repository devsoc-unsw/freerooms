import "@testing-library/jest-dom";

import { Booking } from "@common/types";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import IconButton from "@mui/material/IconButton";
import {
  fireEvent,
  getByTestId,
  queryByAttribute,
  render,
  screen,
} from "@testing-library/react";
import { Provider } from "react-redux";

import BookingCalendar from "../components/BookingCalendar";
import store from "../redux/store";

describe("Booking Calendar", () => {
  beforeAll(() => {
    // Suppress console.warn messages
    console.warn = jest.fn();
  });

  // test prop for booking calendar
  const start: Date = new Date();
  const end: Date = new Date();
  const events: Booking[] = [
    {
      name: "s",
      bookingType: "a",
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

  it("renders the outer stack", () => {
    const { queryByTestId } = render(
      <Provider store={store}>
        <BookingCalendar events={events} />
      </Provider>
    );

    const outerStack = queryByTestId("outerStack");

    expect(outerStack).toBeInTheDocument();
  });

  it("renders the inner stack", () => {
    const { queryByTestId } = render(
      <Provider store={store}>
        <BookingCalendar events={events} />
      </Provider>
    );

    const innerStack = queryByTestId("innerStack");

    expect(innerStack).toBeInTheDocument();
  });

  it("renders the calendar container", () => {
    const { queryByTestId } = render(
      <Provider store={store}>
        <BookingCalendar events={events} />
      </Provider>
    );

    const calendarContainer = queryByTestId("calendarContainer");

    expect(calendarContainer).toBeInTheDocument();
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
