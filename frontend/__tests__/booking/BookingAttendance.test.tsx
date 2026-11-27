import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import BookingAttendance from "@frontend/components/booking/BookingAttendance";
import { screen } from "@testing-library/react";

describe("BookingAttendance", () => {
  it("displays planned attendance and capacity", () => {
    render(<BookingAttendance plannedSize={250} capacity={292} />);

    expect(screen.getByText("250")).toBeInTheDocument();
    expect(screen.getByText("/ 292")).toBeInTheDocument();
    expect(screen.getByText("86%")).toBeInTheDocument();
  });

  it("displays full capacity correctly", () => {
    render(<BookingAttendance plannedSize={30} capacity={30} />);

    expect(screen.getByText("100%")).toBeInTheDocument();

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });

  it("caps the progress bar for overcapacity bookings", () => {
    render(<BookingAttendance plannedSize={36} capacity={30} />);

    expect(screen.getByText("120%")).toBeInTheDocument();

    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });

  it.each([0, null, undefined, -1, NaN, Infinity])(
    "handles unspecified or invalid attendance: %s",
    (plannedSize) => {
      render(<BookingAttendance plannedSize={plannedSize} capacity={30} />);

      expect(screen.getByText("Not specified")).toBeInTheDocument();

      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    },
  );

  it.each([0, null, undefined])("handles unknown capacity: %s", (capacity) => {
    render(<BookingAttendance plannedSize={24} capacity={capacity} />);

    expect(screen.getByText("24")).toBeInTheDocument();

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
