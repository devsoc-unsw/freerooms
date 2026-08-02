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

// Mock nuqs since useQuerySort and useQueryFilter both use it,
// and it requires the app router context to be mounted.
jest.mock("nuqs", () => ({
  useQueryState: (_key: string, options: { defaultValue: string }) => [
    options.defaultValue,
    jest.fn(),
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

describe("Browsing Page", () => {
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
});
