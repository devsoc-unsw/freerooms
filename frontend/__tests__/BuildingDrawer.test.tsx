import "@testing-library/jest-dom";

import { useMediaQuery } from "@mui/material";
import { fireEvent, screen } from "@testing-library/react";

import BuildingDrawer from "../views/BuildingDrawer";
import renderWithRedux from "./utils/renderWithRedux";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));
jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn().mockReturnValue(false),
}));
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

const building = {
  name: "Ainsworth",
  id: "K-J17",
  lat: 0,
  long: 0,
  aliases: [],
};

const preloadedState = {
  currentBuilding: {
    value: building,
  },
};

describe("BuildingDrawer", () => {
  beforeEach(() => {
    (useMediaQuery as unknown as jest.Mock).mockReturnValue(false);
  });

  it("Building Drawer shows close button", () => {
    renderWithRedux(<BuildingDrawer />, { preloadedState });
    const button = screen.getByRole("button", { name: /close/i });
    expect(button).toBeInTheDocument();
  });

  it("Building Drawer has correct width default (non-mobile view)", () => {
    renderWithRedux(<BuildingDrawer />, { preloadedState });
    const drawer = screen.getByLabelText(/building-drawer/i);
    expect(drawer).toBeInTheDocument();
    expect(getComputedStyle(drawer).getPropertyValue("width")).toBe("400px");
  });

  it("Building Drawer has correct width for mobile view", () => {
    (useMediaQuery as unknown as jest.Mock).mockReturnValue(true);
    renderWithRedux(<BuildingDrawer />, { preloadedState });
    const drawer = screen.getByLabelText(/building-drawer/i);
    expect(drawer).toBeInTheDocument();
    expect(getComputedStyle(drawer).getPropertyValue("width")).toBe("100%");
  });

  it("Correct building name is displayed", () => {
    renderWithRedux(<BuildingDrawer />, { preloadedState });
    const buildingName = screen.getByText(/Ainsworth/i);
    expect(buildingName).toBeInTheDocument();
  });

  it("Correct alternate description for image of building", () => {
    renderWithRedux(<BuildingDrawer />, { preloadedState });
    const image = screen.getByAltText(/Image of building K-J17/i);
    expect(image).toBeInTheDocument();
  });

  it("shows View on Map when directions are not provided", () => {
    renderWithRedux(<BuildingDrawer />, { preloadedState });

    expect(
      screen.getByRole("button", { name: /view on map/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /get directions/i })
    ).not.toBeInTheDocument();
  });

  it("shows Get Directions when a directions callback is provided", () => {
    renderWithRedux(<BuildingDrawer onGetDirections={jest.fn()} />, {
      preloadedState,
    });

    expect(
      screen.getByRole("button", { name: /get directions/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /view on map/i })
    ).not.toBeInTheDocument();
  });

  it("passes the current building to the directions callback", () => {
    const onGetDirections = jest.fn();

    renderWithRedux(<BuildingDrawer onGetDirections={onGetDirections} />, {
      preloadedState,
    });

    fireEvent.click(screen.getByRole("button", { name: /get directions/i }));

    expect(onGetDirections).toHaveBeenCalledTimes(1);
    expect(onGetDirections).toHaveBeenCalledWith(building);
  });

  it("disables the directions button while directions are loading", () => {
    const onGetDirections = jest.fn();

    renderWithRedux(
      <BuildingDrawer
        onGetDirections={onGetDirections}
        isDirectionsLoading={true}
      />,
      { preloadedState }
    );

    const button = screen.getByRole("button", {
      name: /getting directions/i,
    });

    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onGetDirections).not.toHaveBeenCalled();
  });
});
