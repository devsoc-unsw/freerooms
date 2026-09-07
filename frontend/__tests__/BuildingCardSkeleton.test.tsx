import "@testing-library/jest-dom";

import { render } from "@testing-library/react";
import BuildingCardSkeleton from "components/skeletons/BuildingCardSkeleton";
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

  it("gives the building image placeholder the same fixed height as the card image", () => {
    const { container } = render(<BuildingCardSkeleton />);

    // the image is the first child of the card and the first rounded skeleton
    const image = container.querySelector<HTMLElement>(".MuiSkeleton-rounded");

    expect(image?.style.height).toBe("249px");
  });

  it("disappears once the building data has loaded", () => {
    mockUseBuildings.mockReturnValue({ buildings: undefined });

    const { container, rerender } = render(
      <CardList sort="alphabetical" query="" />
    );

    // one 249px image placeholder per card skeleton while loading
    const imagePlaceholders = () =>
      Array.from(
        container.querySelectorAll<HTMLElement>(".MuiSkeleton-rounded")
      ).filter((el) => el.style.height === "249px");

    expect(imagePlaceholders().length).toBe(44);

    mockUseBuildings.mockReturnValue({
      buildings: [
        { id: "K-J17", name: "Ainsworth", lat: 0, long: 0, aliases: [] },
      ],
    });
    rerender(<CardList sort="alphabetical" query="" />);

    expect(imagePlaceholders().length).toBe(0);
    expect(
      container.querySelector(".MuiSkeleton-root")
    ).not.toBeInTheDocument();
  });
});
