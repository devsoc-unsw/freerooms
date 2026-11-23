import { renderWithTheme } from "@frontend/__tests__/utils/renderWithProviders";
import Branding from "@frontend/components/landing/Branding";
import { screen } from "@testing-library/react";

describe("Branding", () => {
  test("shows the logo and name", () => {
    renderWithTheme(<Branding />);

    expect(screen.getByAltText("Freerooms Logo")).toBeInTheDocument();
    expect(screen.getByText("Freerooms")).toBeInTheDocument();
  });

  test("uses the accent colour by default", () => {
    renderWithTheme(<Branding />);

    expect(screen.getByText("Freerooms")).toHaveStyle({ color: "#D4613C" });
  });

  test("uses the given text colour", () => {
    renderWithTheme(<Branding textColor="rgb(1, 2, 3)" />);

    expect(screen.getByText("Freerooms")).toHaveStyle({
      color: "rgb(1, 2, 3)",
    });
  });

  test("does not pass textColor on to the DOM", () => {
    renderWithTheme(<Branding textColor="rgb(1, 2, 3)" />);

    expect(screen.getByText("Freerooms")).not.toHaveAttribute("textcolor");
  });
});
