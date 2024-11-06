import "@testing-library/jest-dom";

import { createTheme, ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import AllRoomsFilter from "../components/AllRoomsFilter";
import Room from "../components/AllRoomsRoom";
import AllRoomsSearchBar from "../components/AllRoomsSearchBar";
import NavBar from "../components/NavBar";
import store from "../redux/store";

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
    render(<AllRoomsSearchBar />);

    const building = screen.getByText("Building");
    const capacity = screen.getByText("Capacity");
    const when = screen.getByText("When");
    const duration = screen.getByText("Duration");

    expect(building).toBeInTheDocument();
    expect(capacity).toBeInTheDocument();
    expect(when).toBeInTheDocument();
    expect(duration).toBeInTheDocument();
  });

  it("renders AllRoomsFilter", () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={createTheme({})}>
          <AllRoomsFilter filters={{}} />
        </ThemeProvider>
      </Provider>
    );

    const roomType = screen.getByText("Room Type");
    const location = screen.getByText("Location");
    const idRequired = screen.getByText("ID Required");

    expect(roomType).toBeInTheDocument();
    expect(location).toBeInTheDocument();
    expect(idRequired).toBeInTheDocument();
  });

  describe("renders AllRoomsRoom", () => {
    it("renders AllRoomsRoom - Available", () => {
      const roomStatus = {
        status: "free" as const,
        endtime: new Date().toISOString(),
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
        endtime: new Date().toISOString(),
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
        endtime: new Date().toISOString(),
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
  });
});
