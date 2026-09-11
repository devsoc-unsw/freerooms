import "@testing-library/jest-dom";

import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithRedux";
import Features from "@frontend/components/landing/Features";
import { screen } from "@testing-library/react";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

describe("Features", () => {
  it("renders heading text", () => {
    render(<Features />);

    const heading = screen.getByText("Our Features");

    expect(heading).toBeInTheDocument();
  });

  it("shows BrowseBuildings icon", () => {
    render(<Features />);

    const browseBuildings = screen.getByText("Browse Buildings");

    expect(browseBuildings).toBeInTheDocument();
  });

  it("shows map icon", () => {
    render(<Features />);

    const map = screen.getByText("Map");

    expect(map).toBeInTheDocument();
  });

  it("shows Timetable icon", () => {
    render(<Features />);

    const timetable = screen.getByText("Timetable");

    expect(timetable).toBeInTheDocument();
  });
});
