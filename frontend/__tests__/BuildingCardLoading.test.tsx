import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
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
  default: ({ buildingId }: { buildingId?: string }) => (
    <div
      data-testid={buildingId ? "building-card" : "building-card-placeholder"}
    />
  ),
}));
jest.mock("../components/BuildingCardMobile", () => ({
  __esModule: true,
  default: ({ buildingId }: { buildingId?: string }) => (
    <div
      data-testid={
        buildingId ? "building-card-mobile" : "building-card-mobile-placeholder"
      }
    />
  ),
}));

const mockUseBuildings = useBuildings as jest.Mock;

describe("CardList loading state", () => {
  it("renders both card variants as placeholders while loading, then real cards", () => {
    mockUseBuildings.mockReturnValue({ buildings: undefined });

    const { container, rerender } = render(
      <CardList sort="alphabetical" query="" />
    );

    const count = (testid: string) =>
      container.querySelectorAll(`[data-testid="${testid}"]`).length;

    // loading -> CardList renders both the desktop and mobile card with no id,
    // so each renders its own skeleton (CSS decides which is visible).
    expect(count("building-card-placeholder")).toBeGreaterThan(0);
    expect(count("building-card-mobile-placeholder")).toBe(
      count("building-card-placeholder")
    );
    expect(count("building-card")).toBe(0);
    expect(count("building-card-mobile")).toBe(0);

    mockUseBuildings.mockReturnValue({
      buildings: [
        { id: "K-J17", name: "Ainsworth", lat: 0, long: 0, aliases: [] },
      ],
    });
    rerender(<CardList sort="alphabetical" query="" />);

    // loaded -> placeholders gone, one real card of each variant
    expect(count("building-card-placeholder")).toBe(0);
    expect(count("building-card-mobile-placeholder")).toBe(0);
    expect(count("building-card")).toBe(1);
    expect(count("building-card-mobile")).toBe(1);
  });
});
