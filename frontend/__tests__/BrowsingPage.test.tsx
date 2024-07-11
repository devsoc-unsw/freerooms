import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

import Page from "../app/browse/page";
import store from "../redux/store";

describe("Browsing Page", () => {
  it("renders DesktopTimePicker", () => {
    render(
      <Provider store={store}>
        <Page />
      </Provider>
    );
    const timePicker = screen.getByRole("button", {
      name: /Choose time, selected time is/i,
    });
    expect(timePicker).toBeInTheDocument();
  });
});
