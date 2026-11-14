import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import FilterChecklist from "@frontend/components/filters/FilterChecklist";
import FilterSlider from "@frontend/components/filters/FilterSlider";
import { fireEvent, screen } from "@testing-library/react";

const idDropdown = {
  text: "ID Required",
  key: "id" as const,
  items: [
    { text: "Yes", value: "true" },
    { text: "No", value: "false" },
  ],
};

const capacityDropdown = {
  text: "Room Capacity",
  key: "capacity" as const,
  items: [
    { text: "25+", value: "25" },
    { text: "50+", value: "50" },
    { text: "100+", value: "100" },
    { text: "200+", value: "200" },
  ],
};

describe("FilterChecklist", () => {
  it("shows the title and every option", () => {
    render(<FilterChecklist dropdown={idDropdown} onSelect={() => {}} />);

    expect(screen.getByText("ID Required")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
  });

  it("marks only the selected option as checked", () => {
    render(
      <FilterChecklist dropdown={idDropdown} value="true" onSelect={() => {}} />
    );

    expect(
      screen.getByText("Yes").closest('[role="checkbox"]')
    ).toHaveAttribute("aria-checked", "true");
    expect(screen.getByText("No").closest('[role="checkbox"]')).toHaveAttribute(
      "aria-checked",
      "false"
    );
  });

  it("selects an option when it is clicked", () => {
    const onSelect = jest.fn();
    render(<FilterChecklist dropdown={idDropdown} onSelect={onSelect} />);

    fireEvent.click(screen.getByText("No"));

    expect(onSelect).toHaveBeenCalledWith("false");
  });

  it("clears the filter when the selected option is clicked again", () => {
    const onSelect = jest.fn();
    render(
      <FilterChecklist
        dropdown={idDropdown}
        value="false"
        onSelect={onSelect}
      />
    );

    fireEvent.click(screen.getByText("No"));

    expect(onSelect).toHaveBeenCalledWith(null);
  });
});

describe("FilterSlider", () => {
  // accordion starts collapsed, so its content counts as hidden
  it("shows the title and starts at Any when no value is set", () => {
    render(<FilterSlider dropdown={capacityDropdown} onCommit={() => {}} />);

    expect(screen.getByText("Room Capacity")).toBeInTheDocument();
    expect(screen.getByRole("slider", { hidden: true })).toHaveValue("0");
  });

  it("starts at the position of the current value", () => {
    render(
      <FilterSlider
        dropdown={capacityDropdown}
        value="100"
        onCommit={() => {}}
      />
    );

    // positions: Any, 25+, 50+, 100+, 200+
    expect(screen.getByRole("slider", { hidden: true })).toHaveValue("3");
  });
});
