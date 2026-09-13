import "@testing-library/jest-dom";

import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithRedux";
import DirectionsSummary from "@frontend/components/map/DirectionSummary";
import type { RouteSummary } from "@frontend/hooks/useMapboxRoute";
import { fireEvent, screen } from "@testing-library/react";

const createSummary = (
  overrides: Partial<RouteSummary> = {}
): RouteSummary => ({
  destinationBuildingId: "K-J17",
  destinationName: "Electrical Engineering Building",
  distanceMeters: 735,
  durationSeconds: 542,
  ...overrides,
});

describe("DirectionsSummary", () => {
  it("displays the walking duration, distance and destination", () => {
    render(<DirectionsSummary summary={createSummary()} onClose={() => {}} />);

    expect(screen.getByText("10 min (735 m)")).toBeInTheDocument();
    expect(
      screen.getByText("Walking to Electrical Engineering Building")
    ).toBeInTheDocument();
  });

  it("formats distances of at least one kilometre in kilometres", () => {
    render(
      <DirectionsSummary
        summary={createSummary({ distanceMeters: 1500 })}
        onClose={() => {}}
      />
    );

    expect(screen.getByText("10 min (1.5 km)")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    const onClose = jest.fn();

    render(<DirectionsSummary summary={createSummary()} onClose={onClose} />);

    fireEvent.click(screen.getByRole("button", { name: "Close directions" }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
