import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import store from "../redux/store";
import BuildingDrawer from "../views/BuildingDrawer";
import renderWithRedux from "./utils/renderWithRedux";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

describe("Available soon text", () => {
  it("shows room status text without wrapping", async () => {
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

    const roomStatusText = await screen.findByText("Available Soon");
    expect(roomStatusText).toBeInTheDocument();
    expect(roomStatusText).toHaveStyle("white-space: nowrap");
  });
});
