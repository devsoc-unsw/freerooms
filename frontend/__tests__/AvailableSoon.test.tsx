import "@testing-library/jest-dom";

import store from "../redux/store";

import { Provider } from "react-redux";

import { render, screen } from "@testing-library/react";

import BuildingDrawer from "../views/BuildingDrawer";

describe("Available soon text", () => {
  it("shows room status text without wrapping", () => {
    render(
      <Provider store={store}>
        <BuildingDrawer open={true} />
      </Provider>
    );

    const roomStatusText = screen.getByText("Available Soon");
    expect(roomStatusText).toBeInTheDocument();
    expect(roomStatusText).toHaveStyle("white-space: nowrap");
  });
});
