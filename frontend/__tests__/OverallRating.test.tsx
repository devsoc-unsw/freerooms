import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";

import OverallRating from "../components/OverallRating";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

describe("OverallRating", () => {
  it("renders decimal rating", () => {
    render(<OverallRating />);

    const decimalRating = screen.getByLabelText("decimal-rating");

    expect(decimalRating).toBeInTheDocument();
  });

  it("renders leave a review", () => {
    render(<OverallRating />);

    const review = screen.getByLabelText("leave-review-link");

    expect(review).toBeInTheDocument();
  });
});
