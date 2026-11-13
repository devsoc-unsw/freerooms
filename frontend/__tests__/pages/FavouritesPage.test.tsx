import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import Page from "@frontend/app/favourites/page";
import store from "@frontend/redux/store";
import { NO_START_TIME } from "@frontend/utils/constants";
import { act, fireEvent, screen } from "@testing-library/react";
import { Provider } from "react-redux";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/favourites",
}));

const mockSetStart = jest.fn();
let mockStart = "";

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

const mockUseDisplayedFavouriteRooms = jest.fn();
jest.mock("@frontend/hooks/rooms/useDisplayedFavouriteRooms", () => ({
  __esModule: true,
  default: (query: string, sort: string, availableOnly: boolean) =>
    mockUseDisplayedFavouriteRooms(query, sort, availableOnly),
}));

jest.mock("@frontend/components/map/BuildingDrawer", () => ({
  __esModule: true,
  default: () => <div data-testid="building-drawer" />,
}));

jest.mock("@frontend/components/rooms/RoomCardList", () => ({
  __esModule: true,
  default: ({ rooms }: { rooms?: { id: string; name: string }[] }) => (
    <div data-testid="room-card-list">
      {rooms
        ? rooms.map((room) => <span key={room.id}>{room.name}</span>)
        : "loading"}
    </div>
  ),
}));

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

describe("Favourites page", () => {
  beforeEach(() => {
    mockUseDisplayedFavouriteRooms.mockReturnValue([]);
    mockStart = "";
    mockSetStart.mockClear();
  });

  it("renders the title, search and the Filters, Sort and Time buttons", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { name: "Favourite Rooms" })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search for favourite rooms")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Filters" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sort" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Time" })).toBeInTheDocument();
  });

  it("starts with only the favourites free at the start time", () => {
    renderPage();

    expect(mockUseDisplayedFavouriteRooms).toHaveBeenCalledWith(
      "",
      "alphabetical",
      true
    );
  });

  it("puts start=none in the URL when the start time is cleared", async () => {
    renderPage();

    await clickButton("Time");
    await clickButton("Clear start time");

    expect(mockSetStart).toHaveBeenCalledWith(NO_START_TIME);
  });

  it("shows every favourite when the URL says there is no start time", () => {
    mockStart = NO_START_TIME;

    renderPage();

    expect(mockUseDisplayedFavouriteRooms).toHaveBeenLastCalledWith(
      "",
      "alphabetical",
      false
    );
  });

  it("hands the favourite rooms to the list", () => {
    mockUseDisplayedFavouriteRooms.mockReturnValue([
      { id: "K-J17-101", name: "Ainsworth 101" },
    ]);

    renderPage();

    expect(screen.getByText("Ainsworth 101")).toBeInTheDocument();
  });

  it("passes undefined to the list while the rooms are loading", () => {
    mockUseDisplayedFavouriteRooms.mockReturnValue(undefined);

    renderPage();

    expect(screen.getByText("loading")).toBeInTheDocument();
  });
});
