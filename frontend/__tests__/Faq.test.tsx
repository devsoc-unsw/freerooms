import "@testing-library/jest-dom";

import { render, screen } from "@testing-library/react";

import Faq from "../components/Faq";

describe("Faq", () => {
  it("renders Faq heading", () => {
    render(<Faq />);
    const heading = screen.getByText("Frequently Asked Questions");
    expect(heading).toBeInTheDocument();
  });
  it("renders Faq text", () => {
    render(<Faq />);
    expect(
      screen.getByText(
        /unfortunately, as a student society we aren't able to make bookings for rooms\.use the 'make a booking' button on the individual room pages to be redirected to the appropriate portals or contacts for bookings\./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /our data is updated periodically, so please be patient\. library bookings are updated every 15 minutes, all other bookings are updated once a week\./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /freerooms is built and maintained by the unsw software development society \(devsoc\)\.if you're looking to join the team, or make open source contributions, please visit for more information\./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /while freerooms can tell you anything you want to know about when a room is booked, there isn't much we can do if a person decides to take an unbooked room\.to make sure are this person, keep an eye out for rooms marked 'available soon' and get in there before anyone else can!/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /freerooms currently only displays rooms managed by the unsw timetabling team, and library rooms\.other rooms \(such as those booked through outlook\) are not yet supported, but we're actively exploring ways to integrate additional data sources, so stay tuned for future updates!/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /the team have put their all into creating a responsive web app for seamless desktop and mobile experiences\. but that's not all — as a first for devsoc, we are currently in the active development phase of an exciting new mobile app for freerooms\. stay tuned for future updates!/i
      )
    ).toBeInTheDocument();
  });
  it("check website link", () => {
    render(<Faq />);
    const linkElement = screen.getByText("our website");
    expect(linkElement).toHaveAttribute(
      "href",
      "https://devsoc.app/get-involved"
    );
  });
});
