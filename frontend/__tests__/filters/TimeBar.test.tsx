import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import TimeBar from "@frontend/components/booking/TimeBar";
import { clearFilters, setFilter } from "@frontend/redux/slices/filtersSlice";
import store from "@frontend/redux/store";
import { act, fireEvent, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { Provider } from "react-redux";

const renderTimeBar = (props: ComponentProps<typeof TimeBar> = {}) =>
  render(
    <Provider store={store}>
      <TimeBar {...props} />
    </Provider>
  );

const clickButton = async (name: string) => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name }));
  });
};

describe("TimeBar", () => {
  beforeEach(() => {
    store.dispatch(clearFilters());
  });

  it("opens a panel with a start and an end time", async () => {
    renderTimeBar();

    await clickButton("Time");

    expect(
      screen.getByText("Input availability (from → to)")
    ).toBeInTheDocument();
    expect(screen.getByText("Start time")).toBeInTheDocument();
    expect(screen.getByText("End time")).toBeInTheDocument();
  });

  it("starts with a start time and no end time", async () => {
    renderTimeBar();

    await clickButton("Time");

    expect(screen.getAllByText("No end time")).toHaveLength(2);
    expect(screen.queryByText("No start time")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Clear start time" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Clear end time" })
    ).not.toBeInTheDocument();
  });

  it("shows 'No start time' once the start has been cleared", async () => {
    renderTimeBar({ startIsSet: false });

    await clickButton("Time");

    expect(screen.getAllByText("No start time")).toHaveLength(2);
    expect(
      screen.queryByRole("button", { name: "Clear start time" })
    ).not.toBeInTheDocument();
  });

  it("tells the page when the start is cleared, and drops the end time", async () => {
    store.dispatch(setFilter({ key: "duration", value: "60" }));
    const onStartIsSetChange = jest.fn();
    renderTimeBar({ startIsSet: true, onStartIsSetChange });

    await clickButton("Time");
    await clickButton("Clear start time");

    expect(onStartIsSetChange).toHaveBeenCalledWith(false);
    expect(store.getState().filters.value.duration).toBeUndefined();
  });

  it("lets the end time be cleared again", async () => {
    store.dispatch(setFilter({ key: "duration", value: "60" }));
    renderTimeBar();

    await clickButton("Time");
    expect(screen.queryByText("No end time")).not.toBeInTheDocument();

    await clickButton("Clear end time");

    expect(store.getState().filters.value.duration).toBeUndefined();
  });

  it("counts a start as set while an end time exists", async () => {
    store.dispatch(setFilter({ key: "duration", value: "60" }));
    renderTimeBar({ startIsSet: false });

    await clickButton("Time");

    expect(screen.queryByText("No start time")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Clear start time" })
    ).toBeInTheDocument();
  });
});
