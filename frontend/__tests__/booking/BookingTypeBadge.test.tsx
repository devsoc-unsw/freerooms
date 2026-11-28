import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import BookingTypeBadge from "@frontend/components/booking/BookingTypeBadge";
import { getBookingTypeAppearance } from "@frontend/utils/bookingAppearance";
import { screen } from "@testing-library/react";
import { BookingType } from "common/types";

describe("BookingTypeBadge", () => {
  it.each([
    [BookingType.LECTURE, "Lecture"],
    [BookingType.LABORATORY, "Laboratory"],
    [BookingType.TUTORIAL_LABORATORY, "Tutorial / Laboratory"],
    [BookingType.SOCIETY, "Society"],
    [BookingType.EXAMS, "Exam"],
    [BookingType.MISC, "Miscellaneous"],
  ])("renders %s as %s", (type, label) => {
    render(<BookingTypeBadge bookingType={type} />);

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("handles unknown booking types", () => {
    render(<BookingTypeBadge bookingType="UNKNOWN" />);

    expect(screen.getByText("Other")).toBeInTheDocument();
  });
});

describe("getBookingTypeAppearance", () => {
  it("uses the laboratory colour for combined tutorial laboratories", () => {
    expect(
      getBookingTypeAppearance(BookingType.TUTORIAL_LABORATORY).colour
    ).toBe("laboratory");
  });

  it("uses the fallback colour for unknown booking types", () => {
    expect(getBookingTypeAppearance("UNKNOWN").colour).toBe("other");
  });
});
