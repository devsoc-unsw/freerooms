import "@testing-library/jest-dom";

import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithRedux";
import RoomRatingList from "@frontend/components/ratings/RoomRatingList";
import { screen } from "@testing-library/react";

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
