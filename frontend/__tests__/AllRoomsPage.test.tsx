import "@testing-library/jest-dom";

import { createTheme, ThemeProvider } from "@mui/material";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import AllRoomsFilter from "../components/AllRoomsFilter";
import AllRoomsRoom from "../components/AllRoomsRoom";
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
      <ThemeProvider theme={createTheme({})}>
        <AllRoomsFilter />
      </ThemeProvider>
    );

    const roomType = screen.getByText("Room type");
    const location = screen.getByText("Location");
    const idRequired = screen.getByText("ID Required");

    expect(roomType).toBeInTheDocument();
    expect(location).toBeInTheDocument();
    expect(idRequired).toBeInTheDocument();
  });
});
