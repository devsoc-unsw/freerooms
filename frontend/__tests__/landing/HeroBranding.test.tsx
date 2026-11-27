import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import HeroBranding from "@frontend/components/landing/HeroBranding";
import { fireEvent, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("HeroBranding", () => {
  const push = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  it("navigates to browse with the entered search text", () => {
    render(<HeroBranding />);

    fireEvent.change(
      screen.getByRole("searchbox", { name: "Search for free rooms" }),
      {
        target: { value: "  Electrical & WiFi  " },
      }
    );
    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(push).toHaveBeenCalledWith("/browse?q=Electrical%20%26%20WiFi");
  });

  it("navigates to browse without a query for an empty search", () => {
    render(<HeroBranding />);

    fireEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(push).toHaveBeenCalledWith("/browse");
  });

  it("keeps the door logo clickable", () => {
    render(<HeroBranding />);

    const door = screen.getByRole("button", { name: "Close Freerooms door" });
    expect(door).toHaveAttribute("aria-pressed", "false");

    fireEvent.click(door);
    expect(
      screen.getByRole("button", { name: "Open Freerooms door" })
    ).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(
      screen.getByRole("button", { name: "Open Freerooms door" })
    );
    expect(
      screen.getByRole("button", { name: "Close Freerooms door" })
    ).toHaveAttribute("aria-pressed", "false");
  });
});
