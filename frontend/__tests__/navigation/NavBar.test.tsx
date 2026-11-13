import { renderWithTheme } from "@frontend/__tests__/utils/renderWithProviders";
import { DarkModeContext } from "@frontend/app/clientLayout";
import NavBar from "@frontend/components/navigation/NavBar";
import { fireEvent, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";

// NavBar and clientLayout import each other, so replace the layout with just
// the context that the NavBar reads
jest.mock("@frontend/app/clientLayout", () => ({
  __esModule: true,
  DarkModeContext: jest
    .requireActual("react")
    .createContext({ isDarkMode: false, toggleDarkMode: () => {} }),
}));

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  usePathname: jest.fn(),
}));

const toggleDarkMode = jest.fn();

const renderNavBar = ({
  path = "/",
  isDarkMode = false,
}: { path?: string; isDarkMode?: boolean } = {}) => {
  (usePathname as jest.Mock).mockReturnValue(path);

  return renderWithTheme(
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      <NavBar />
    </DarkModeContext.Provider>
  );
};

// The desktop and mobile navbars are both in the DOM (they are hidden with CSS
// media queries, which jsdom does not apply), so most links appear twice
describe("NavBar", () => {
  describe("links", () => {
    test.each([
      ["Browse buildings and rooms", "/browse"],
      ["Go to favourites page", "/favourites"],
      ["Go to bookings page", "/bookings"],
      ["Go to map", "/map"],
    ])("%s links to %s", (ariaLabel, href) => {
      renderNavBar();

      const links = screen.getAllByRole("link", { name: ariaLabel });
      expect(links.length).toBeGreaterThan(0);
      links.forEach((link) => expect(link).toHaveAttribute("href", href));
    });

    test("the logo links to the home page", () => {
      renderNavBar();

      const logo = screen.getByAltText("Freerooms Logo");
      expect(logo.closest("a")).toHaveAttribute("href", "/");
    });

    test("the sponsors link is on the top navbar", () => {
      renderNavBar();

      expect(
        screen.getByRole("link", { name: "Go to sponsors page" })
      ).toHaveAttribute("href", "/sponsors");
    });
  });

  describe("current page", () => {
    test("marks the link for the current page", () => {
      renderNavBar({ path: "/map" });

      const current = screen
        .getAllByRole("link", { name: "Go to map" })
        .filter((link) => link.getAttribute("aria-current") === "page");
      expect(current).toHaveLength(1);
    });

    test("marks no link as current on the home page", () => {
      renderNavBar({ path: "/" });

      screen
        .getAllByRole("link")
        .forEach((link) =>
          expect(link).not.toHaveAttribute("aria-current", "page")
        );
    });
  });

  describe("dark mode", () => {
    test("toggles dark mode from the top navbar", () => {
      renderNavBar();

      fireEvent.click(screen.getByRole("button", { name: "Use dark mode" }));
      expect(toggleDarkMode).toHaveBeenCalledTimes(1);
    });

    test("offers light mode when dark mode is on", () => {
      renderNavBar({ isDarkMode: true });

      const button = screen.getByRole("button", { name: "Use light mode" });
      expect(button).toHaveAttribute("aria-pressed", "true");
      expect(
        screen.queryByRole("button", { name: "Use dark mode" })
      ).not.toBeInTheDocument();
    });
  });

  describe("mobile more menu", () => {
    test("is closed until opened", () => {
      renderNavBar();

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Open more options" })
      ).toHaveAttribute("aria-expanded", "false");
    });

    test("opens with home, sponsors, dark mode and profile", () => {
      renderNavBar();

      fireEvent.click(
        screen.getByRole("button", { name: "Open more options" })
      );

      const menu = screen.getByRole("menu");
      expect(menu).toBeInTheDocument();
      expect(
        screen.getByRole("menuitem", { name: "Go to home page" })
      ).toHaveAttribute("href", "/");
      expect(
        screen.getByRole("menuitem", { name: "Go to sponsors page" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("menuitem", { name: "Use dark mode" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("menuitem", { name: "Profile (coming soon)" })
      ).toHaveAttribute("aria-disabled", "true");
    });

    test("toggles dark mode from the menu", () => {
      renderNavBar();

      fireEvent.click(
        screen.getByRole("button", { name: "Open more options" })
      );
      fireEvent.click(screen.getByRole("menuitem", { name: "Use dark mode" }));

      expect(toggleDarkMode).toHaveBeenCalledTimes(1);
    });
  });

  describe("tablet hamburger menu", () => {
    test("opens a dropdown with every page", () => {
      renderNavBar();

      fireEvent.click(
        screen.getByRole("button", { name: "Open navigation menu" })
      );

      const items = screen.getAllByRole("menuitem");
      expect(items.map((item) => item.getAttribute("href"))).toEqual([
        "/browse",
        "/favourites",
        "/bookings",
        "/map",
        "/sponsors",
      ]);
    });
  });

  describe("login", () => {
    test("shows a coming soon popover", () => {
      renderNavBar();

      expect(screen.queryByText("Coming soon!")).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Login" }));
      expect(screen.getByText("Coming soon!")).toBeInTheDocument();
    });
  });
});
