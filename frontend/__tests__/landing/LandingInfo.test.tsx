import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import LandingInfo from "@frontend/components/landing/LandingInfo";
import { screen } from "@testing-library/react";

describe("LandingInfo", () => {
  it("renders the disclaimer, contact information and copyright", () => {
    render(<LandingInfo />);

    expect(
      screen.getByRole("region", { name: "About Freerooms" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/not an official UNSW site/i)).toBeInTheDocument();
    expect(
      screen.getByText("© UNSW Software Development Society 2026"),
    ).toBeInTheDocument();
    expect(screen.getByText("Contact us")).toBeInTheDocument();
  });

  it("links to the feedback form, FAQ and DevSoc", () => {
    render(<LandingInfo />);

    expect(screen.getByRole("link", { name: "here" })).toHaveAttribute(
      "href",
      "https://forms.gle/jMzhQXXfyQiBGjQaA",
    );
    expect(screen.getByRole("link", { name: "FAQ" })).toHaveAttribute(
      "href",
      "#landing-faq",
    );
    expect(
      screen.getByRole("link", { name: "https://devsoc.app/get-involved" }),
    ).toHaveAttribute("href", "https://devsoc.app/get-involved");
  });

  it.each([
    ["Email", "mailto:contact@devsoc.app"],
    ["GitHub", "https://github.com/devsoc-unsw/freerooms"],
    ["Facebook", "https://www.facebook.com/devsocUNSW/"],
    ["Instagram", "https://www.instagram.com/devsoc_unsw/"],
    ["LinkedIn", "https://www.linkedin.com/company/97436660/"],
    ["Discord", "https://discord.com/invite/u9p34WUTcs"],
  ])("links to %s", (label, href) => {
    render(<LandingInfo />);

    expect(screen.getByRole("link", { name: label })).toHaveAttribute(
      "href",
      href,
    );
  });
});
