import "@testing-library/jest-dom";

import { Booking } from "@common/types";
import { render, screen } from "@testing-library/react";
import mediaQuery from "css-mediaquery";
import { Provider } from "react-redux";

import BookingCalendar from "../components/BookingCalendar";
import store from "../redux/store";

// Ref: https://stackoverflow.com/questions/56180772/jest-material-ui-correctly-mocking-usemediaquery
function createMatchMedia(width: number) {
  return (query: string): MediaQueryList => ({
    matches: mediaQuery.match(query, { width }) as boolean,
    media: "",
    addListener: () => {},
    removeListener: () => {},
    onchange: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true,
  });
}

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

describe("Booking Calendar Desktop", () => {
  it("renders the calendar", () => {
    render(
      <Provider store={store}>
        <BookingCalendar events={events} />
      </Provider>
    );

    const calendar = screen.getByRole("table", {
      name: "Room Booking Calendar",
    });

    expect(calendar).toBeInTheDocument();
  });

  it("does not render previous and next day arrow icon buttons", () => {
    render(
      <Provider store={store}>
        <BookingCalendar events={events} />
      </Provider>
    );

    const beforeButton = screen.queryByRole("button", { name: "Previous day" });
    const nextButton = screen.queryByRole("button", { name: "Next day" });

    expect(beforeButton).not.toBeInTheDocument();
    expect(nextButton).not.toBeInTheDocument();
  });
});

describe("Booking Calendar Mobile", () => {
  it("renders previous and next day arrow icon buttons", async () => {
    // Breakpoint is set to show arrows when width < 900px
    window.matchMedia = createMatchMedia(350);

    render(
      <Provider store={store}>
        <BookingCalendar events={events} />
      </Provider>
    );

    const beforeButton = screen.getByRole("button", { name: "Previous day" });
    const nextButton = screen.getByRole("button", { name: "Next day" });

    expect(beforeButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });
});
