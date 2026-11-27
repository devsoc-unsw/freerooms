import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import DropdownField from "@frontend/components/booking/DropdownField";
import { act, fireEvent, screen } from "@testing-library/react";

const clickButton = async (name: string) => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name }));
  });
};

describe("DropdownField", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("shows only its label until it is clicked", () => {
    render(
      <DropdownField icon={<span />} label="Pick a date">
        {() => <span>Calendar</span>}
      </DropdownField>,
    );

    expect(screen.getByRole("button", { name: "Pick a date" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByText("Calendar")).not.toBeInTheDocument();
  });

  it("opens and closes when its button is clicked", async () => {
    render(
      <DropdownField icon={<span />} label="Pick a date">
        {() => <span>Calendar</span>}
      </DropdownField>,
    );

    await clickButton("Pick a date");
    expect(screen.getByText("Calendar")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pick a date" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    await clickButton("Pick a date");
    expect(screen.queryByText("Calendar")).not.toBeInTheDocument();
  });

  it("lets its content close it", async () => {
    render(
      <DropdownField icon={<span />} label="Pick a date">
        {(close) => (
          <button type="button" onClick={close}>
            Done
          </button>
        )}
      </DropdownField>,
    );

    await clickButton("Pick a date");
    await clickButton("Done");

    expect(screen.queryByText("Done")).not.toBeInTheDocument();
  });

  it("tells its content how wide the field is", async () => {
    jest
      .spyOn(HTMLElement.prototype, "offsetWidth", "get")
      .mockReturnValue(240);
    render(
      <DropdownField icon={<span />} label="Pick a date">
        {(_close, anchorWidth) => <span>{`width ${anchorWidth}`}</span>}
      </DropdownField>,
    );

    await clickButton("Pick a date");

    expect(screen.getByText("width 240")).toBeInTheDocument();
  });
});
