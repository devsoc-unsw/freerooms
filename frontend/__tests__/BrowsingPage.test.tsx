import "@testing-library/jest-dom";

import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithRedux";
import Page from "@frontend/app/browse/page";
import useUserLocation from "@frontend/hooks/useUserLocation";
import store from "@frontend/redux/store";
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
jest.mock("@frontend/hooks/useUserLocation");

const mockUseUserLocation = useUserLocation as jest.MockedFunction<
  typeof useUserLocation
>;

jest.mock("@frontend/views/BuildingDrawer", () => ({
  __esModule: true,
  default: ({ date }: { date?: string }) => (
    <div data-testid="building-drawer" data-date={date} />
  ),
}));

describe("Browsing Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseQueryState.mockImplementation(
      (_key: string, options: { defaultValue: string }) => [
        options.defaultValue,
        jest.fn(),
      ]
    );

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

  it("renders DesktopTimePicker", () => {
    render(
      <Provider store={store}>
        <Page />
      </Provider>
    );

    const datePicker = screen.getByRole("button", {
      name: /Choose date, selected date i/i,
    });

    const timePicker = screen.getByRole("button", {
      name: /Choose time, selected time is/i,
    });

    expect(timePicker).toBeInTheDocument();
    expect(datePicker).toBeInTheDocument();
  });

  it("passes selected date to BuildingDrawer", () => {
    mockUseQueryState.mockImplementation(
      (key: string, options: { defaultValue: string }) => [
        key === "date" ? "2026-09-11" : options.defaultValue,
        jest.fn(),
      ]
    );

    render(
      <Provider store={store}>
        <Page />
      </Provider>
    );

    const buildingDrawer = screen.getByTestId("building-drawer");

    expect(buildingDrawer).toHaveAttribute("data-date", "2026-09-11");
  });
});
