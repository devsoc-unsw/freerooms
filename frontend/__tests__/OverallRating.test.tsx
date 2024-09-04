import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";

import OverallRating from "../components/OverallRating";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

describe("OverallRating", () => {
  it("renders overall rating title", () => {
    render(<OverallRating />);

    const heading = screen.getByText("Overall Rating");

    expect(heading).toBeInTheDocument();
  });

  it("renders linear ratings", () => {
    render(<OverallRating />);

    const linearRatings = screen.getByRole("generic", {
      name: "Linear Ratings",
    });

    expect(linearRatings).toBeInTheDocument();
  });

  it("renders overall number and star rating", () => {
    render(<OverallRating />);

    const numberStarRating = screen.getByRole("generic", {
      name: "Number Star Rating",
    });

    expect(numberStarRating).toBeInTheDocument();
  });

  it("renders leave a review", () => {
    render(<OverallRating />);

    const review = screen.getByRole("button", {
      name: "Leave A Review",
    });

    expect(review).toBeInTheDocument();
  });
});
