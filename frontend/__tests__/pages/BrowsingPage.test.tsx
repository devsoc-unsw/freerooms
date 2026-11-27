import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import Page from "@frontend/app/browse/page";
import useUserLocation from "@frontend/hooks/map/useUserLocation";
import store from "@frontend/redux/store";
import { NO_START_TIME } from "@frontend/utils/constants";
import { screen } from "@testing-library/react";
import { Provider } from "react-redux";

// Mock next/navigation since the app router is not mounted in the test environment.
const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mockReplace }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/browse",
}));

// Mock nuqs
const mockUseQueryState = jest.fn();

jest.mock("nuqs", () => ({
  useQueryState: (key: string, options: { defaultValue: string }) =>
    mockUseQueryState(key, options),
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

// The browsing page tests do not use geolocation itself.
jest.mock("@frontend/hooks/map/useUserLocation");

const mockUseUserLocation = useUserLocation as jest.MockedFunction<
  typeof useUserLocation
>;

jest.mock("@frontend/components/map/BuildingDrawer", () => ({
  __esModule: true,
  default: ({ date }: { date?: string }) => (
    <div data-testid="building-drawer" data-date={date} />
  ),
}));

const mockUseDisplayedRooms = jest.fn();
jest.mock("@frontend/hooks/rooms/useDisplayedRooms", () => ({
  __esModule: true,
  default: (options: unknown) => mockUseDisplayedRooms(options),
}));

jest.mock("@frontend/components/rooms/RoomCardList", () => ({
  __esModule: true,
  default: ({
    rooms,
    emptyMessage,
  }: {
    rooms?: { id: string; name: string }[];
    emptyMessage?: string;
  }) => (
    <div>
      {rooms?.length === 0 && emptyMessage}
      {rooms?.map((room) => (
        <span key={room.id}>{room.name}</span>
      ))}
    </div>
  ),
}));

// Sets the URL params the page reads. Anything not listed keeps its default.
const setUrlParams = (params: Record<string, string>) => {
  mockUseQueryState.mockImplementation(
    (key: string, options: { defaultValue: string }) => [
      params[key] ?? options.defaultValue,
      jest.fn(),
    ]
  );
};

const renderPage = () =>
  render(
    <Provider store={store}>
      <Page />
    </Provider>
  );

describe("Browsing Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    setUrlParams({});

    mockUseUserLocation.mockReturnValue({
      location: null,
      userLat: undefined,
      userLng: undefined,
      isLocating: false,
      locationError: null,
      refreshLocation: jest.fn().mockResolvedValue({
        lat: -33.91767,
        lng: 151.23129,
      }),
      clearLocationError: jest.fn(),
    });
  });

  it("renders the view toggle and the Filters, Sort and Time buttons", () => {
    renderPage();

    expect(
      screen.getByRole("radio", { name: "Building View" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Room View" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filters" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sort" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Time" })).toBeInTheDocument();
  });

  it("shows the rooms instead of the buildings when the URL says view=rooms", () => {
    setUrlParams({ view: "rooms" });
    mockUseDisplayedRooms.mockReturnValue([
      { id: "K-J17-101", name: "Ainsworth 101" },
    ]);

    renderPage();

    expect(screen.getByText("Ainsworth 101")).toBeInTheDocument();
    expect(screen.queryByTestId("building-drawer")).not.toBeInTheDocument();
  });

  it("asks for rooms free at the start time while a start time is set", () => {
    setUrlParams({ view: "rooms" });
    mockUseDisplayedRooms.mockReturnValue([]);

    renderPage();

    expect(mockUseDisplayedRooms).toHaveBeenCalledWith({
      query: "",
      sort: "alphabetical",
      availableOnly: true,
    });
    expect(
      screen.getByText(
        "No rooms are free at the start time. Clear it to see every room."
      )
    ).toBeInTheDocument();
  });

  it("shows every room and a filters message once the start time is cleared", () => {
    setUrlParams({ view: "rooms", start: NO_START_TIME });
    mockUseDisplayedRooms.mockReturnValue([]);

    renderPage();

    expect(mockUseDisplayedRooms).toHaveBeenCalledWith({
      query: "",
      sort: "alphabetical",
      availableOnly: false,
    });
    expect(
      screen.getByText("No rooms match your filters.")
    ).toBeInTheDocument();
  });

  it("passes selected date to BuildingDrawer", () => {
    setUrlParams({ date: "2026-09-11" });

    renderPage();

    expect(screen.getByTestId("building-drawer")).toHaveAttribute(
      "data-date",
      "2026-09-11"
    );
  });
});
