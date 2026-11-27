import renderWithRedux from "@frontend/__tests__/utils/renderWithProviders";
import MapMarker from "@frontend/components/map/MapMarker";
import { shouldCancelRoute } from "@frontend/utils/routeSelection";
import { fireEvent, screen } from "@testing-library/react";

const building = {
  name: "Ainsworth",
  id: "K-J17",
  lat: -33.918527,
  long: 151.23126,
  aliases: [],
};

jest.mock("@frontend/hooks/buildings/useBuilding", () => ({
  __esModule: true,
  default: () => ({ building }),
}));
jest.mock("@frontend/hooks/buildings/useBuildingStatus", () => ({
  __esModule: true,
  default: () => ({ status: undefined }),
}));
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
}));

describe("cancelling a route when another building is picked", () => {
  describe("shouldCancelRoute", () => {
    it("cancels when a different building is picked", () => {
      expect(
        shouldCancelRoute({
          routeDestinationId: "K-G27",
          isRouteLoading: false,
          selectedBuildingId: "K-J17",
        })
      ).toBe(true);
    });

    it("keeps the route when its own building is picked again", () => {
      expect(
        shouldCancelRoute({
          routeDestinationId: "K-J17",
          isRouteLoading: false,
          selectedBuildingId: "K-J17",
        })
      ).toBe(false);
    });

    it("does nothing when there is no route", () => {
      expect(
        shouldCancelRoute({
          routeDestinationId: undefined,
          isRouteLoading: false,
          selectedBuildingId: "K-J17",
        })
      ).toBe(false);
    });

    it("cancels a route that is still loading, whichever building is picked", () => {
      expect(
        shouldCancelRoute({
          routeDestinationId: undefined,
          isRouteLoading: true,
          selectedBuildingId: "K-J17",
        })
      ).toBe(true);
    });
  });

  describe("MapMarker", () => {
    it("reports the building when its marker is clicked", () => {
      const onSelect = jest.fn();

      renderWithRedux(
        <MapMarker
          buildingId={building.id}
          distance={undefined}
          duration={undefined}
          currentHover={null}
          setCurrentHover={jest.fn()}
          onSelect={onSelect}
        />
      );

      fireEvent.click(screen.getByTestId("map-marker-dot"));

      expect(onSelect).toHaveBeenCalledWith(building);
    });
  });
});
