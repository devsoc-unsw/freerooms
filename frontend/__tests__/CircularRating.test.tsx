import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import RoomRatingList from "components/Rating/RoomRatingList";

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
