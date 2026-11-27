import CardList from "@frontend/components/rooms/CardList";
import useBuildings from "@frontend/hooks/buildings/useBuildings";
import useStatus from "@frontend/hooks/rooms/useStatus";
import { render } from "@testing-library/react";
import React from "react";

// CardList animates the grid with framer-motion; stub it so exiting children
// unmount immediately (jsdom never completes the exit animation otherwise).
jest.mock("motion/react", () => ({
  __esModule: true,
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  motion: new Proxy(
    {},
    {
      get:
        () =>
        ({ children }: { children?: React.ReactNode }) => <div>{children}</div>,
    },
  ),
}));
jest.mock("@frontend/hooks/buildings/useBuildings", () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock("@frontend/hooks/rooms/useStatus", () => ({
  __esModule: true,
  default: jest.fn(() => ({ status: undefined })),
}));
jest.mock("@frontend/hooks/map/useUserLocation", () => ({
  __esModule: true,
  default: () => ({ userLat: null, userLng: null }),
}));
jest.mock("@frontend/hooks/rooms/useRooms", () => ({
  __esModule: true,
  default: () => ({ rooms: undefined }),
}));
jest.mock("@frontend/components/rooms/BuildingCard", () => ({
  __esModule: true,
  default: ({ buildingId }: { buildingId?: string }) => (
    <div
      data-testid={buildingId ? "building-card" : "building-card-placeholder"}
    />
  ),
}));
jest.mock("@frontend/components/rooms/BuildingCardMobile", () => ({
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
const mockUseStatus = useStatus as jest.Mock;

describe("CardList loading state", () => {
  beforeEach(() => {
    mockUseStatus.mockReturnValue({
      status: undefined,
    });
  });

  it("renders both card variants as placeholders while loading, then real cards", () => {
    mockUseBuildings.mockReturnValue({ buildings: undefined });

    const { container, rerender } = render(
      <CardList sort="alphabetical" query="" />,
    );

    const count = (testid: string) =>
      container.querySelectorAll(`[data-testid="${testid}"]`).length;

    // loading -> CardList renders both the desktop and mobile card with no id,
    // so each renders its own skeleton (CSS decides which is visible).
    expect(count("building-card-placeholder")).toBeGreaterThan(0);
    expect(count("building-card-mobile-placeholder")).toBe(
      count("building-card-placeholder"),
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

  it("excludes buildings missing from the filtered status response", () => {
    mockUseBuildings.mockReturnValue({
      buildings: [
        { id: "K-J17", name: "Ainsworth", lat: 0, long: 0, aliases: [] },
        { id: "K-J19", name: "Other Building", lat: 0, long: 0, aliases: [] },
      ],
    });

    mockUseStatus.mockReturnValue({
      status: {
        "K-J17": {
          numAvailable: 1,
          roomStatuses: {
            "101": {
              status: "free",
              endtime: "",
            },
          },
        },
      },
    });

    const { container } = render(<CardList sort="alphabetical" query="" />);

    expect(
      container.querySelectorAll('[data-testid="building-card"]'),
    ).toHaveLength(1);
  });

  it("shows no buildings when all buildings are filtered out", () => {
    mockUseBuildings.mockReturnValue({
      buildings: [
        { id: "K-J17", name: "Ainsworth", lat: 0, long: 0, aliases: [] },
      ],
    });

    mockUseStatus.mockReturnValue({
      status: {},
    });

    const { container } = render(<CardList sort="alphabetical" query="" />);

    expect(
      container.querySelectorAll('[data-testid="building-card"]'),
    ).toHaveLength(0);
  });
});
