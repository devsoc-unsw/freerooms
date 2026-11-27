import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import Page from "@frontend/app/bookings/page";
import { setDatetime } from "@frontend/redux/slices/datetimeSlice";
import { clearFilters, setFilter } from "@frontend/redux/slices/filtersSlice";
import store from "@frontend/redux/store";
import type { Filters } from "@frontend/types";
import { NO_START_TIME } from "@frontend/utils/constants";
import { act, fireEvent, screen } from "@testing-library/react";
import type {
  BookingsPaginationResponse,
  PaginatedBooking,
} from "common/types";
import { Provider } from "react-redux";

type GetKey = (
  pageIndex: number,
  previousPage: BookingsPaginationResponse | null
) => string | null;

const mockSetStart = jest.fn();
let mockStart = "";

const mockUseSWRInfinite = jest.fn();
let mockGetKey: GetKey | undefined;
let mockSWRResult: {
  data?: BookingsPaginationResponse[];
  error?: Error;
  isLoading: boolean;
  isValidating: boolean;
  size: number;
  setSize: jest.Mock;
};

jest.mock("nuqs", () => ({
  useQueryState: (key: string, options: { defaultValue: string }) => [
    key === "start" ? mockStart : options.defaultValue,
    key === "start" ? mockSetStart : jest.fn(),
  ],
  useQueryStates: (keys: Record<string, { defaultValue: string }>) => [
    Object.fromEntries(
      Object.entries(keys).map(([key, options]) => [key, options.defaultValue])
    ),
    jest.fn(),
  ],
  parseAsString: {
    withDefault: (defaultValue: string) => ({ defaultValue }),
  },
}));

jest.mock("swr/infinite", () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockUseSWRInfinite(...args),
}));

jest.mock("@frontend/config", () => ({
  API_URL: "http://localhost:3000/api",
}));

jest.mock("@frontend/components/booking/BookingsCardList", () => ({
  __esModule: true,
  default: ({
    bookings,
    emptyMessage,
  }: {
    bookings?: PaginatedBooking[];
    emptyMessage?: string;
  }) => (
    <div data-testid="bookings-card-list">
      {bookings
        ? bookings.length > 0
          ? bookings.map((booking) => (
              <span key={booking.occurrenceId}>{booking.name}</span>
            ))
          : emptyMessage
        : "loading"}
    </div>
  ),
}));

// Mock booking data for testing
const booking: PaginatedBooking = {
  roomId: "K-K17-102",
  occurrenceId: "occurrence-1",
  eventId: "event-1",
  name: "COMP1531 Tutorial Lab",
  bookingType: "TUTORIAL",
  start: new Date("2026-11-27T01:00:00.000Z"),
  end: new Date("2026-11-27T02:00:00.000Z"),
  plannedSize: 30,
  bookingModules: [],
};

const pageResponse: BookingsPaginationResponse = {
  bookings: [booking],
  nextCursor: null,
  hasMore: false,
};

const renderPage = () =>
  render(
    <Provider store={store}>
      <Page />
    </Provider>
  );

const clickButton = async (name: string) => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name }));
  });
};

const getRequestParams = (
  pageIndex = 0,
  previousPage: BookingsPaginationResponse | null = null
) => {
  if (!mockGetKey) throw new Error("SWR page key was not captured");
  const key = mockGetKey(pageIndex, previousPage);
  return key ? new URL(key).searchParams : null;
};

describe("Bookings page", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    store.dispatch(clearFilters());
    store.dispatch(setDatetime(new Date("2026-11-27T01:00:00.000Z")));
    mockStart = NO_START_TIME;
    mockSetStart.mockClear();
    mockGetKey = undefined;

    mockSWRResult = {
      data: [pageResponse],
      error: undefined,
      isLoading: false,
      isValidating: false,
      size: 1,
      setSize: jest.fn(),
    };

    mockUseSWRInfinite.mockImplementation((getKey: GetKey) => {
      mockGetKey = getKey;
      return mockSWRResult;
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the search and Filters, Sort, and Time controls", () => {
    renderPage();

    expect(
      screen.getByPlaceholderText("Search for bookings")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filters" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sort" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Time" })).toBeInTheDocument();
  });

  it("requests bookings with earliest-start sorting by default", () => {
    renderPage();

    const params = getRequestParams();
    expect(params?.get("limit")).toBe("25");
    expect(params?.get("sort")).toBe("ascendingStart");
    expect(params?.has("search")).toBe(false);
    expect(params?.has("startTime")).toBe(false);
  });

  it("puts start=none in the URL when the start time is cleared", async () => {
    mockStart = "";
    renderPage();

    await clickButton("Time");
    await clickButton("Clear start time");

    expect(mockSetStart).toHaveBeenCalledWith(NO_START_TIME);
  });

  it("passes returned bookings to the Bookings Card List", () => {
    renderPage();

    expect(screen.getByText("COMP1531 Tutorial Lab")).toBeInTheDocument();
  });

  it("passes undefined to the list while bookings are loading", () => {
    mockSWRResult = {
      ...mockSWRResult,
      data: undefined,
      isLoading: true,
    };

    renderPage();

    expect(screen.getByText("loading")).toBeInTheDocument();
  });

  it("includes search, filter, and time selections in the request", () => {
    mockStart = "selected";
    store.dispatch(setFilter({ key: "location", value: "lower" }));
    store.dispatch(
      setFilter({ key: "bookingType" as keyof Filters, value: "TUTORIAL" })
    );
    store.dispatch(
      setFilter({ key: "plannedSize" as keyof Filters, value: "50" })
    );
    store.dispatch(setFilter({ key: "duration", value: "60" }));

    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Search for bookings"), {
      target: { value: "  comp1531  " },
    });
    act(() => {
      jest.advanceTimersByTime(100);
    });

    const params = getRequestParams();
    expect(params?.get("search")).toBe("comp1531");
    expect(params?.get("location")).toBe("lower");
    expect(params?.get("bookingType")).toBe("TUTORIAL");
    expect(params?.get("plannedSize")).toBe("50");
    expect(params?.get("startTime")).toBe("2026-11-27T01:00:00.000Z");
    expect(params?.get("endTime")).toBe("2026-11-27T02:00:00.000Z");
  });

  it("uses the next cursor and stops requesting pages when there are no more results", () => {
    renderPage();

    const nextPage: BookingsPaginationResponse = {
      bookings: [],
      nextCursor: "cursor-value",
      hasMore: true,
    };

    expect(getRequestParams(1, nextPage)?.get("cursor")).toBe("cursor-value");
    expect(getRequestParams(1, { ...nextPage, hasMore: false })).toBeNull();
    expect(getRequestParams(1, { ...nextPage, nextCursor: null })).toBeNull();
  });

  it("shows a request error and the empty state", () => {
    mockSWRResult = {
      ...mockSWRResult,
      error: new Error("Request failed"),
      data: [{ bookings: [], nextCursor: null, hasMore: false }],
    };

    renderPage();

    expect(screen.getByText("Failed to load bookings")).toBeInTheDocument();
    expect(screen.getByText("No bookings found")).toBeInTheDocument();
  });
});
