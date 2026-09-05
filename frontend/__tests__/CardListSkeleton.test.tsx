import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import CardListSkeleton from "components/skeletons/CardListSkeleton";

describe("CardListSkeleton", () => {
  it("renders a grid of building card skeletons", () => {
    const { container } = render(<CardListSkeleton />);
    const NUM_BUILDINGS = 44

    const grid = container.firstElementChild;

    expect(grid).toBeInTheDocument();
    // There are 44 buildings on campus 
    expect(grid?.children.length).toBe(NUM_BUILDINGS);
  });
});
