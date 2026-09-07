import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import CardListSkeleton from "components/skeletons/CardListSkeleton";
import React from "react";

import useBuildings from "../hooks/useBuildings";
import CardList from "../views/CardList";

jest.mock("react-flip-move", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
jest.mock("../hooks/useBuildings", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("../hooks/useStatus", () => ({
  __esModule: true,
  default: () => ({ status: undefined }),
}));
jest.mock("../hooks/useUserLocation", () => ({
  __esModule: true,
  default: () => ({ userLat: null, userLng: null }),
}));
jest.mock("../components/BuildingCard", () => ({
  __esModule: true,
  default: () => <div data-testid="building-card" />,
}));
jest.mock("../components/BuildingCardMobile", () => ({
  __esModule: true,
  default: () => <div data-testid="building-card" />,
}));

const mockUseBuildings = useBuildings as jest.Mock;

describe("CardListSkeleton", () => {
  it("renders a grid of building card skeletons", () => {
    const { container } = render(<CardListSkeleton />);
    const NUM_BUILDINGS = 44;

    const grid = container.firstElementChild;

    expect(grid).toBeInTheDocument();
    // There are 44 buildings on campus
    expect(grid?.children.length).toBe(NUM_BUILDINGS);
  });

  it("is shown while buildings load and disappears once they arrive", () => {
    mockUseBuildings.mockReturnValue({ buildings: undefined });

    const { container, rerender } = render(
      <CardList sort="alphabetical" query="" />
    );

    // loading -> skeleton placeholders present, no real cards
    expect(container.querySelector(".MuiSkeleton-root")).toBeInTheDocument();
    expect(
      container.querySelectorAll('[data-testid="building-card"]').length
    ).toBe(0);

    mockUseBuildings.mockReturnValue({
      buildings: [
        { id: "K-J17", name: "Ainsworth", lat: 0, long: 0, aliases: [] },
      ],
    });
    rerender(<CardList sort="alphabetical" query="" />);

    // loaded -> skeletons gone, real card rendered
    expect(
      container.querySelector(".MuiSkeleton-root")
    ).not.toBeInTheDocument();
    expect(
      container.querySelectorAll('[data-testid="building-card"]').length
    ).toBe(1);
  });
});
