import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";

import Sponsors from "../components/Sponsors";

describe("Sponsors", () => {
  it("renders heading text", () => {
    render(<Sponsors />);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Our Sponsors",
    });

    expect(heading).toBeInTheDocument();
  });

  it("shows TikTok logo", () => {
    render(<Sponsors />);

    const tiktok = screen.getByRole("img", { name: "TikTok" });

    expect(tiktok).toBeInTheDocument();
  });

  it("shows Jane Street logo", () => {
    render(<Sponsors />);

    const janeStreet = screen.getByRole("img", { name: "Jane Street" });

    expect(janeStreet).toBeInTheDocument();
  });
});
