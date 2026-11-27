import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import BookingHeader from "@frontend/components/booking/BookingHeader";
import { screen } from "@testing-library/react";

const booking = {
  name: "COMP2521 LEC",
  bookingType: "LECTURE",
};

describe("BookingHeader", () => {
  it("renders the booking name as the page heading", () => {
    render(<BookingHeader booking={booking} />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: booking.name,
      })
    ).toBeInTheDocument();
  });

  it("renders the booking type badge", () => {
    render(<BookingHeader booking={booking} />);

    expect(screen.getByText("Lecture")).toBeInTheDocument();
  });

  it("displays the building and room name", () => {
    render(
      <BookingHeader
        booking={booking}
        buildingName="June Griffith"
        roomName="Computer Lab 713"
      />
    );

    expect(
      screen.getByText("June Griffith / Computer Lab 713")
    ).toBeInTheDocument();
  });

  it("does not duplicate identical location names", () => {
    render(
      <BookingHeader
        booking={booking}
        buildingName="Rex Vowels Theatre"
        roomName="Rex Vowels Theatre"
      />
    );

    expect(screen.getByText("Rex Vowels Theatre")).toBeInTheDocument();

    expect(
      screen.queryByText("Rex Vowels Theatre / Rex Vowels Theatre")
    ).not.toBeInTheDocument();
  });

  it("handles missing building information", () => {
    render(<BookingHeader booking={booking} roomName="Computer Lab 713" />);

    expect(screen.getByText("Computer Lab 713")).toBeInTheDocument();
  });
});
