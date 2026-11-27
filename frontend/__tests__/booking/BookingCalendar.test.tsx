import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import BookingCalendar from "@frontend/components/booking/BookingCalendar";
import store from "@frontend/redux/store";
import { getColours } from "@frontend/theme/colours";
import toSydneyTime from "@frontend/utils/toSydneyTime";
import { alpha } from "@mui/material/styles";
import { fireEvent, screen } from "@testing-library/react";
import { Booking, BookingType } from "common/types";
import mediaQuery from "css-mediaquery";
import { Provider } from "react-redux";

const mockUseQueryStates = jest.fn();

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: () => ({
    push: mockPush,
  }),
}));

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

  mockPush.mockClear();
});

describe("Booking Calendar Desktop", () => {
  it("renders the calendar", () => {
    render(
      <Provider store={store}>
        <BookingCalendar events={events} />
      </Provider>,
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
      </Provider>,
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
        <BookingCalendar events={events} />
      </Provider>,
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
        <BookingCalendar events={events} />
      </Provider>,
    );

    const dayButton = screen.getByRole("button", { name: "Day" });

    expect(dayButton).toHaveAttribute("aria-pressed", "true");
  });
});

describe("Booking Calendar Mobile", () => {
  it("renders previous and next day arrow icon buttons", async () => {
    // Breakpoint is set to show arrows when width < 900px
    window.matchMedia = createMatchMedia(350);

    render(
      <Provider store={store}>
        <BookingCalendar events={events} />
      </Provider>,
    );

    const beforeButton = screen.getByRole("button", { name: "Previous day" });
    const nextButton = screen.getByRole("button", { name: "Next day" });

    expect(beforeButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();
  });
});

describe("Booking calendar navigation", () => {
  const booking: Booking = {
    roomId: "K-F17-LG3",
    occurrenceId: "occurrence-123",
    name: "COMP2521 LEC",
    bookingType: "LECTURE",
    start: new Date("2026-01-04T22:00:00Z"),
    end: new Date("2026-01-05T00:00:00Z"),
  };

  beforeEach(() => {
    mockUseQueryStates.mockReturnValue([
      {
        view: "day",
        date: "2026-01-05",
      },
      jest.fn(),
    ]);
  });

  it("opens the selected booking", () => {
    render(
      <Provider store={store}>
        <BookingCalendar events={[booking]} />
      </Provider>,
    );

    fireEvent.click(screen.getByText("COMP2521 LEC (LECTURE)"));

    expect(mockPush).toHaveBeenCalledWith("/booking/K-F17-LG3/occurrence-123");
  });

  it.each([{ roomId: undefined }, { occurrenceId: undefined }])(
    "does not navigate with missing identifiers",
    (missing) => {
      render(
        <Provider store={store}>
          <BookingCalendar events={[{ ...booking, ...missing }]} />
        </Provider>,
      );

      fireEvent.click(screen.getByText("COMP2521 LEC (LECTURE)"));

      expect(mockPush).not.toHaveBeenCalled();
    },
  );

  it.each([
    [BookingType.LECTURE, "lecture", "Lecture"],
    [BookingType.BLOCK, "internal", "Block Booking"],
    [BookingType.EXAMS, "exam", "Exam"],
    [BookingType.MISC, "other", "Miscellaneous"],
  ] as const)(
    "renders the correct colours and icon for %s",
    (bookingType, colour, label) => {
      render(
        <Provider store={store}>
          <BookingCalendar events={[{ ...booking, bookingType }]} />
        </Provider>,
      );

      const event = screen
        .getByText(`COMP2521 LEC (${bookingType})`)
        .closest(".rbc-event");

      const appearance = getColours("light").bookingType[colour];

      expect(event).toHaveStyle({
        backgroundColor: appearance.background,
        color: appearance.text,
        borderColor: alpha(appearance.text, 0.24),
      });

      expect(screen.getByRole("img", { name: label })).toBeInTheDocument();
    },
  );

  it.each(["Enter", " "])(
    "opens the selected booking using the %s key",
    (key) => {
      render(
        <Provider store={store}>
          <BookingCalendar events={[booking]} />
        </Provider>,
      );

      const event = screen
        .getByText("COMP2521 LEC (LECTURE)")
        .closest(".rbc-event");

      expect(event).not.toBeNull();

      fireEvent.keyDown(event!, { key });

      expect(mockPush).toHaveBeenCalledWith(
        "/booking/K-F17-LG3/occurrence-123",
      );
    },
  );

  it("marks bookings with valid identifiers as clickable", () => {
    render(
      <Provider store={store}>
        <BookingCalendar events={[booking]} />
      </Provider>,
    );

    const event = screen
      .getByText("COMP2521 LEC (LECTURE)")
      .closest(".rbc-event");

    expect(event).toHaveClass("booking-clickable");
    expect(event).toHaveStyle({ cursor: "pointer" });
  });

  it("does not mark bookings without identifiers as clickable", () => {
    render(
      <Provider store={store}>
        <BookingCalendar events={[{ ...booking, occurrenceId: undefined }]} />
      </Provider>,
    );

    const event = screen
      .getByText("COMP2521 LEC (LECTURE)")
      .closest(".rbc-event");

    expect(event).not.toBeNull();
    expect(event).not.toHaveClass("booking-clickable");
    expect(event).toHaveStyle({ cursor: "default" });
  });
});
