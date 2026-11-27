import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import RecurringWeeksSlider from "@frontend/components/booking/RecurringWeeksSlider";
import type { DropDown } from "@frontend/types";
import { fireEvent, screen } from "@testing-library/react";
import { useState } from "react";

const dropdown: DropDown = {
  text: "Recurring",
  key: "recurring",
  items: [1, 2, 3, 4].map((weeks) => ({
    text: weeks === 1 ? "1 week" : `${weeks} weeks`,
    value: `${weeks}`,
  })),
};

// The accordion starts collapsed, which hides the slider from role queries
const getSlider = () => screen.getByRole("slider", { hidden: true });

// Lets a test change the value prop from outside, like the filters do
const Controlled = () => {
  const [value, setValue] = useState<string | undefined>("3");
  return (
    <>
      <button type="button" onClick={() => setValue(undefined)}>
        Reset from outside
      </button>
      <RecurringWeeksSlider
        dropdown={dropdown}
        value={value}
        onCommit={jest.fn()}
      />
    </>
  );
};

describe("RecurringWeeksSlider", () => {
  it("shows Any until a number of weeks is chosen", () => {
    render(<RecurringWeeksSlider dropdown={dropdown} onCommit={jest.fn()} />);

    expect(screen.getByText("Any")).toBeInTheDocument();
  });

  it("shows the number of weeks it was given", () => {
    render(
      <RecurringWeeksSlider
        dropdown={dropdown}
        value="3"
        onCommit={jest.fn()}
      />,
    );

    expect(screen.getByText("3 weeks")).toBeInTheDocument();
  });

  it("commits the chosen number of weeks", () => {
    const onCommit = jest.fn();
    render(<RecurringWeeksSlider dropdown={dropdown} onCommit={onCommit} />);

    fireEvent.change(getSlider(), { target: { value: 4 } });

    expect(onCommit).toHaveBeenCalledWith(4);
    expect(screen.getByText("4 weeks")).toBeInTheDocument();
  });

  it("commits null when set back to the minimum", () => {
    const onCommit = jest.fn();
    render(
      <RecurringWeeksSlider
        dropdown={dropdown}
        value="3"
        onCommit={onCommit}
      />,
    );

    fireEvent.change(getSlider(), { target: { value: 1 } });

    expect(onCommit).toHaveBeenCalledWith(null);
    expect(screen.getByText("Any")).toBeInTheDocument();
  });

  it("follows the value when it changes from outside", () => {
    render(<Controlled />);
    expect(screen.getByText("3 weeks")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reset from outside" }));

    expect(screen.getByText("Any")).toBeInTheDocument();
  });
});
