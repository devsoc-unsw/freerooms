import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import Page from "../app/browse/page";
import store from "../redux/store";

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

jest.mock("views/BuildingDrawer", () => ({
  __esModule: true,
  default: ({ date }: { date?: string }) => (
    <div data-testid="building-drawer" data-date={date} />
  ),
}));

describe("Browsing Page", () => {
  beforeEach(() => {
    mockUseQueryState.mockImplementation(
      (_key: string, options: { defaultValue: string }) => [
        options.defaultValue,
        jest.fn(),
      ]
    );
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
