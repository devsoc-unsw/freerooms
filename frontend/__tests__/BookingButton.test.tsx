import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import Page from "../app/room/[room]/page";

import BookingButton from "../app/room/[room]/page";

jest.mock("../hooks/useRooms", () => {
  const originalModule = jest.requireActual("../hooks/useRooms");
  return {
    __esModule: true,
    default: jest.fn().mockReturnValue({
      rooms: "K-J17-101",
      error: null,
    }),
  };
});

describe("Page", () => {
  test("Button appears and links to library booking", () => {
    render(<Page params={{ room: "K-J17-101" }} />);

    // Trying to use Test-ID
    const bookingButton = screen.getByTestId("booking-button");
    expect(bookingButton).toBeInTheDocument();
  });

  test("Button appears and links to library booking", () => {
    render(<Page params={{ room: "K-J17-101" }} />);

    // Trying to use Label
    const bookingButton = screen.getByLabelText("Make a Booking");
    expect(bookingButton).toBeInTheDocument();

    const linkElement = screen.getByRole("link", { name: "Make a Booking" });
    expect(linkElement).toHaveAttribute(
      "href",
      "https://unswlibrary-bookings.libcal.com"
    );
  });

  test("Button appears and links to learning environments", () => {
    render(<Page params={{ room: "K-J17-101" }} />);

    // Trying to use Role
    const bookingButton = screen.getByRole("button", {
      name: "Make a Booking",
    });
    expect(bookingButton).toBeInTheDocument();

    const linkElement = screen.getByRole("link", { name: "Make a Booking" });
    expect(linkElement).toHaveAttribute(
      "href",
      "https://www.learningenvironments.unsw.edu.au/make-booking/book-room"
    );
  });

  test("Button appears but has no link if school has a name", () => {
    render(<Page params={{ room: "K-J17-101" }} />);

    const bookingButton = screen.getByRole("button", {
      name: "Make a Booking",
    });
    expect(bookingButton).toBeInTheDocument();

    const linkElement = screen.queryByRole("link", { name: "Make a Booking" });
    expect(linkElement).not.toBeInTheDocument();
  });
});
