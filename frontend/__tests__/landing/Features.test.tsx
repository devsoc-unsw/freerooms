import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import Features from "@frontend/components/landing/Features";
import { screen } from "@testing-library/react";

describe("Features", () => {
  it("renders the section heading and all four cards", () => {
    render(<Features />);

    expect(
      screen.getByRole("heading", { name: "Features" })
    ).toBeInTheDocument();

    for (const heading of [
      "Browse Locations",
      "Map View",
      "Favouriting",
      "User Accounts",
    ]) {
      expect(
        screen.getByRole("heading", { name: heading })
      ).toBeInTheDocument();
    }

    expect(screen.getByText("Coming soon!")).toBeInTheDocument();
  });

  it("links to the existing browse, map and favourites pages", () => {
    render(<Features />);

    for (const [name, href] of [
      ["Browse Locations", "/browse"],
      ["Map View", "/map"],
      ["Favouriting", "/favourites"],
    ]) {
      expect(
        screen.getByRole("link", { name: new RegExp(name) })
      ).toHaveAttribute("href", href);
    }
  });

  it("does not link the coming soon account card", () => {
    render(<Features />);

    expect(screen.getByText("User Accounts").closest("a")).toBeNull();
  });
});
