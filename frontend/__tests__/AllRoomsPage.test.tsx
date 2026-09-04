import "@testing-library/jest-dom";

import { createTheme, ThemeProvider } from "@mui/material";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import AllRoomsFilter from "../components/AllRoomsFilter";
import Room from "../components/AllRoomsRoom";
import AllRoomsSearchBar from "../components/AllRoomsSearchBar";
import NavBar from "../components/NavBar";
import store from "../redux/store";
import toSydneyTime from "../utils/toSydneyTime";
import renderWithRedux from "./utils/renderWithRedux";

// Mock DarkModeContext to avoid test failing due to importing NuqsAdapter
jest.mock("../app/clientLayout", () => ({
  DarkModeContext: require("react").createContext({
    isDarkMode: false,
    toggleDarkMode: () => {},
  }),
}));

// Mock next/navigation since the app router is not mounted in the test environment.
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/all-rooms",
}));

// Mock nuqs
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

describe("AllRooms page", () => {
  it("renders AllRooms top icon", () => {
    render(
      <ThemeProvider theme={createTheme({})}>
        <Provider store={store}>
          <NavBar />
        </Provider>
      </ThemeProvider>
    );

    const button = screen.getByRole("link", { name: /All rooms/i });

    expect(button).toBeInTheDocument();
  });

  it("renders AllRoomsSearchBar", () => {
    render(
      <Provider store={store}>
        <AllRoomsSearchBar />
      </Provider>
    );

    expect(screen.getByTestId("CalendarIcon")).toBeInTheDocument();
    expect(screen.getByTestId("ClockIcon")).toBeInTheDocument();
  });

  it("renders AllRoomsFilter", () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={createTheme({})}>
          <AllRoomsFilter
            filters={{
              usage: "Tutorial Room",
              location: "Lower Campus",
              duration: "1+ hours",
            }}
          />
        </ThemeProvider>
      </Provider>
    );

    const roomType = screen.getByText("Room Type");
    const location = screen.getByText("Location");
    const duration = screen.getByText("Duration Free");
    const recurring = screen.getByText("Recurring");

    expect(roomType).toBeInTheDocument();
    expect(location).toBeInTheDocument();
    expect(duration).toBeInTheDocument();
    expect(recurring).toBeInTheDocument();
  });

  describe("renders AllRoomsRoom", () => {
    it("renders AllRoomsRoom - Available", () => {
      const roomStatus = {
        status: "free" as const,
        endtime: toSydneyTime(new Date()).toISOString(),
      };

      render(
        <ThemeProvider theme={createTheme({})}>
          <Room name="Ainsworth G03" roomNumber="5" {...roomStatus} />
        </ThemeProvider>
      );

      const room = screen.getByText("Ainsworth G03");
      const availability = screen.getByText("Available");

      expect(room).toBeInTheDocument();
      expect(availability).toBeInTheDocument();
    });

    it("renders AllRoomsRoom - Unavailable", () => {
      const roomStatus = {
        status: "busy" as const,
        endtime: toSydneyTime(new Date()).toISOString(),
      };

      render(
        <ThemeProvider theme={createTheme({})}>
          <Room name="Ainsworth G03" roomNumber="5" {...roomStatus} />
        </ThemeProvider>
      );

      const room = screen.getByText("Ainsworth G03");
      const availability = screen.getByText("Unavailable");

      expect(room).toBeInTheDocument();
      expect(availability).toBeInTheDocument();
    });

    it("renders AllRoomsRoom - Available Soon", () => {
      const roomStatus = {
        status: "soon" as const,
        endtime: toSydneyTime(new Date()).toISOString(),
      };

      render(
        <ThemeProvider theme={createTheme({})}>
          <Room name="Ainsworth G03" roomNumber="5" {...roomStatus} />
        </ThemeProvider>
      );

      const room = screen.getByText("Ainsworth G03");
      const availability = screen.getByText("Available Soon");

      expect(room).toBeInTheDocument();
      expect(availability).toBeInTheDocument();
    });

    it("allows user to change time in TimePicker", () => {
      const fixedDate = new Date("2026-06-22T:13:00:00");

      const { container } = renderWithRedux(<AllRoomsSearchBar />, {
        preloadedState: { datetime: { value: fixedDate } },
      });

      const inputs = container.querySelectorAll("input");

      // There are only two inputs and the second is the time
      const enterTime = inputs[1];
      fireEvent.change(enterTime, { target: { value: "02:00 PM" } });

      expect(enterTime).not.toHaveValue("01:00 PM");
    });
  });
});
