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

    const BrowseBuildings = screen.getByText("Browse Buildings");

    expect(BrowseBuildings).toBeInTheDocument();
  });

  it("shows map icon", () => {
    render(<Features />);

    const Map = screen.getByText("Map");

    expect(Map).toBeInTheDocument();
  });

  it("shows Timetable icon", () => {
    render(<Features />);

    const Timetable = screen.getByText("Timetable");

    expect(Timetable).toBeInTheDocument();
  });
});
