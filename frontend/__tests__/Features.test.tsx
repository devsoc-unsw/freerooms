import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";

import Features from "../components/Features";

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
