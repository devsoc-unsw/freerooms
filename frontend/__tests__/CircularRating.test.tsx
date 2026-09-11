import "@testing-library/jest-dom";

import { screen } from "@testing-library/react";
import RoomRatingList from "@frontend/components/ratings/RoomRatingList";

import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithRedux";

describe("Rooms page with circular rating component", () => {
  it("renders the CircularRating component", () => {
    const mockParams = "K-J17-101";

    render(<RoomRatingList roomID={mockParams} />);

    const cleanlinessRating = screen.getByText("Cleanliness");
    const quietnessRating = screen.getByText("Quietness");
    const locationRating = screen.getByText("Location");

    expect(cleanlinessRating).toBeInTheDocument();
    expect(quietnessRating).toBeInTheDocument();
    expect(locationRating).toBeInTheDocument();
  });
});
