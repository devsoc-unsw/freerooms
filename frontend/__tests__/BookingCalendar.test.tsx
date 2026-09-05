import "@testing-library/jest-dom";

import { Booking } from "@common/types";
import { render, screen } from "@testing-library/react";
import mediaQuery from "css-mediaquery";
import { Provider } from "react-redux";

import BookingCalendar from "../components/BookingCalendar";
import store from "../redux/store";
import toSydneyTime from "../utils/toSydneyTime";

const mockUseQueryStates = jest.fn();

jest.mock("nuqs", () => ({
  useQueryStates: (...args: unknown[]) => mockUseQueryStates(...args),
  parseAsString: {
    withDefault: (defaultValue: string) => ({ defaultValue }),
  },
}));

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

const start: Date = toSydneyTime(new Date());
const end: Date = toSydneyTime(new Date());
const events: Booking[] = [
  {
    name: "MARK5827 TUT",
    bookingType: "(CLASS)",
    start: start,
    end: end,
  },
];

beforeEach(() => {
  window.matchMedia = createMatchMedia(1024);

  mockUseQueryStates.mockReturnValue([
    {
      view: "week",
      date: "",
    },
    jest.fn(),
  ]);
});

describe("Booking Calendar Desktop", () => {
  it("renders the calendar", () => {
    render(
      <Provider store={store}>
        <BookingCalendar events={events} roomID="test-room" />
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
        <BookingCalendar events={events} roomID="test-room" />
      </Provider>
    );

    const beforeButton = screen.queryByRole("button", { name: "Previous day" });
    const nextButton = screen.queryByRole("button", { name: "Next day" });

    expect(beforeButton).not.toBeInTheDocument();
    expect(nextButton).not.toBeInTheDocument();
  });

  it("uses date from query parameters", () => {
    mockUseQueryStates.mockReturnValue([
      {
        view: "week",
        date: "2026-09-11",
      },
      jest.fn(),
    ]);

    render(
      <Provider store={store}>
        <BookingCalendar events={events} roomID="test-room" />
      </Provider>
    );

    const datePicker = screen.getByDisplayValue("Fri, 11 Sep 2026");

    expect(datePicker).toBeInTheDocument();
  });

  it("uses view from query parameters", () => {
    mockUseQueryStates.mockReturnValue([
      {
        view: "day",
        date: "2026-09-11",
      },
      jest.fn(),
    ]);

    render(
      <Provider store={store}>
        <BookingCalendar events={events} roomID="test-room" />
      </Provider>
    );

    const dayButton = screen.getByRole("button", { name: "Day" });

    expect(dayButton).toHaveClass("rbc-active");
  });
});

describe("Booking Calendar Mobile", () => {
  it("renders previous and next day arrow icon buttons", async () => {
    // Breakpoint is set to show arrows when width < 900px
    window.matchMedia = createMatchMedia(350);

    render(
      <Provider store={store}>
        <BookingCalendar events={events} roomID="test-room" />
      </Provider>
    );

    const beforeButton = screen.getByRole("button", { name: "Previous day" });
    const nextButton = screen.getByRole("button", { name: "Next day" });

    expect(beforeButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });
});
