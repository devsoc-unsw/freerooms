import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";

import BookingButton from "../components/BookingButton";

describe("BookingButton", () => {
  test("Button appears and links to library booking", () => {
    render(<BookingButton school=" " usage="LIB" onClick={() => {}} />);

    const bookingButton = screen.getByRole("button", {
      name: "Make a Booking",
    });
    expect(bookingButton).toBeInTheDocument();

    const linkElement = screen.getByRole("link", { name: "Make a Booking" });
    expect(linkElement).toHaveAttribute(
      "href",
      "https://unswlibrary-bookings.libcal.com"
    );
  });

  test("Button appears and links to learning environments", () => {
    render(<BookingButton school=" " usage=" " onClick={() => {}} />);

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
    render(
      <BookingButton school="something" usage="something" onClick={() => {}} />
    );

    const bookingButton = screen.getByRole("button", {
      name: "Make a Booking",
    });
    expect(bookingButton).toBeInTheDocument();

    const linkElement = screen.queryByRole("link", { name: "Make a Booking" });
    expect(linkElement).not.toBeInTheDocument();
  });
});
