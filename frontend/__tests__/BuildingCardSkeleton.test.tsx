import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import BuildingCardSkeleton from "components/skeletons/BuildingCardSkeleton";

describe("BuildingCardSkeleton", () => {
  it("renders without crashing", () => {
    const { container } = render(<BuildingCardSkeleton />);

    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders a placeholder for the image, name, rating and footer pills", () => {
    const { container } = render(<BuildingCardSkeleton />);

    const skeletons = container.querySelectorAll(".MuiSkeleton-root");

    // image + name + rating + 2 detail pills + arrow pill
    expect(skeletons.length).toBe(6);
  });

  it("renders a rounded placeholder for the building image", () => {
    const { container } = render(<BuildingCardSkeleton />);

    expect(container.querySelector(".MuiSkeleton-rounded")).toBeInTheDocument();
  });
});
