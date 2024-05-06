import "@testing-library/jest-dom";

import useMediaQuery from "@mui/material/useMediaQuery";
import { screen } from "@testing-library/react";

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

describe("BuildingDrawer", () => {
  it("Building Drawer shows close button", () => {
    renderWithRedux(<BuildingDrawer open={true} />, {
      preloadedState: {
        currentBuilding: {
          value: {
            name: "Ainsworth",
            id: "K-J17",
            lat: 0,
            long: 0,
            aliases: [],
          },
        },
      },
    });
    const button = screen.getByRole("button", { name: /close/i });
    expect(button).toBeInTheDocument();
  });

  it("Building Drawer has correct width default (non-mobile view)", () => {
    renderWithRedux(<BuildingDrawer open={true} />, {
      preloadedState: {
        currentBuilding: {
          value: {
            name: "Ainsworth",
            id: "K-J17",
            lat: 0,
            long: 0,
            aliases: [],
          },
        },
      },
    });
    const drawer = screen.getByLabelText(/building-drawer/i);
    expect(drawer).toBeInTheDocument();
    expect(getComputedStyle(drawer).getPropertyValue("width")).toBe("400px");
  });

  it("Building Drawer has correct width for mobile view", () => {
    (useMediaQuery as unknown as jest.Mock).mockReturnValue(true);
    renderWithRedux(<BuildingDrawer open={true} />, {
      preloadedState: {
        currentBuilding: {
          value: {
            name: "Ainsworth",
            id: "K-J17",
            lat: 0,
            long: 0,
            aliases: [],
          },
        },
      },
    });
    const drawer = screen.getByLabelText(/building-drawer/i);
    expect(drawer).toBeInTheDocument();
    expect(getComputedStyle(drawer).getPropertyValue("width")).toBe("100%");
  });

  it("Correct building name is displayed", () => {
    renderWithRedux(<BuildingDrawer open={true} />, {
      preloadedState: {
        currentBuilding: {
          value: {
            name: "Ainsworth",
            id: "K-J17",
            lat: 0,
            long: 0,
            aliases: [],
          },
        },
      },
    });
    const buildingName = screen.getByText(/Ainsworth/i);
    expect(buildingName).toBeInTheDocument();
  });

  it("Correct alternate description for image of building", () => {
    renderWithRedux(<BuildingDrawer open={true} />, {
      preloadedState: {
        currentBuilding: {
          value: {
            name: "Ainsworth",
            id: "K-J17",
            lat: 0,
            long: 0,
            aliases: [],
          },
        },
      },
    });
    const image = screen.getByAltText(/Image of building K-J17/i);
    expect(image).toBeInTheDocument();
  });
});
