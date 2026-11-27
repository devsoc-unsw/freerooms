import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import BookingModuleDetails from "@frontend/components/booking/BookingModuleDetails";
import { screen } from "@testing-library/react";

const academicModule = {
  code: "COMP2521",
  name: "Data Structures and Algorithms",
  term: "U1",
  career: "UGRD",
};

describe("BookingModuleDetails", () => {
  it("displays academic module information", () => {
    render(<BookingModuleDetails modules={[academicModule]} />);

    expect(screen.getByText("COMP2521")).toBeInTheDocument();

    expect(
      screen.getByText("Data Structures and Algorithms")
    ).toBeInTheDocument();

    expect(screen.getByText("Summer Term")).toBeInTheDocument();

    expect(screen.getByText("Undergraduate")).toBeInTheDocument();
  });

  it("displays multiple modules", () => {
    render(
      <BookingModuleDetails
        modules={[
          academicModule,
          {
            code: "COMP1511",
            name: "Programming Fundamentals",
            term: "T1",
            career: "UGRD",
          },
        ]}
      />
    );

    expect(screen.getByText("COMP2521")).toBeInTheDocument();
    expect(screen.getByText("COMP1511")).toBeInTheDocument();
  });

  it("displays non-academic modules", () => {
    render(
      <BookingModuleDetails
        modules={[
          {
            code: "MISCUNSWVENUES",
            name: "UNSW Venues and Event Services",
            term: null,
            career: null,
          },
        ]}
      />
    );

    expect(screen.getByText("MISCUNSWVENUES")).toBeInTheDocument();

    expect(
      screen.getByText("UNSW Venues and Event Services")
    ).toBeInTheDocument();

    expect(screen.queryByText("Undergraduate")).not.toBeInTheDocument();
  });

  it("handles modules containing only a code", () => {
    render(<BookingModuleDetails modules={[{ code: "COMP2521" }]} />);

    expect(screen.getByText("COMP2521")).toBeInTheDocument();
  });

  it("handles modules containing only a name", () => {
    render(<BookingModuleDetails modules={[{ name: "Special Event" }]} />);

    expect(screen.getByText("Special Event")).toBeInTheDocument();
  });

  it("hides the section when there are no modules", () => {
    render(<BookingModuleDetails modules={[]} />);

    expect(
      screen.queryByRole("heading", {
        name: "Course and module information",
      })
    ).not.toBeInTheDocument();
  });

  it("ignores completely empty modules", () => {
    render(
      <BookingModuleDetails
        modules={[
          {
            code: null,
            name: "",
            term: " ",
            career: undefined,
          },
        ]}
      />
    );

    expect(
      screen.queryByRole("heading", {
        name: "Course and module information",
      })
    ).not.toBeInTheDocument();
  });
});
