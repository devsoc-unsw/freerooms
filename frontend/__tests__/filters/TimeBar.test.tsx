import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import TimeBar from "@frontend/components/booking/TimeBar";
import {
  selectDatetime,
  setDatetime,
} from "@frontend/redux/slices/datetimeSlice";
import { clearFilters, setFilter } from "@frontend/redux/slices/filtersSlice";
import store from "@frontend/redux/store";
import { SYDNEY_TIMEZONE } from "@frontend/utils/toSydneyTime";
import { act, fireEvent, screen } from "@testing-library/react";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
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

const clickButtonAt = async (name: string, index: number) => {
  await act(async () => {
    fireEvent.click(screen.getAllByRole("button", { name })[index]);
  });
};

const pickDay = async (day: number) => {
  await act(async () => {
    fireEvent.click(screen.getByRole("gridcell", { name: String(day) }));
  });
};

// fixed Sydney time
const START = fromZonedTime(new Date(2020, 5, 15, 10, 0), SYDNEY_TIMEZONE);
const sydneyDatetime = () =>
  toZonedTime(selectDatetime(store.getState()), SYDNEY_TIMEZONE);

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

describe("picking times", () => {
  beforeEach(() => {
    store.dispatch(clearFilters());
    store.dispatch(setDatetime(START));
  });

  it("moves the start to the picked day and marks the start as set", async () => {
    const onStartIsSetChange = jest.fn();
    renderTimeBar({ onStartIsSetChange });

    await clickButton("Time");
    await clickButton("15th June");
    await pickDay(20);

    expect(sydneyDatetime().getDate()).toBe(20);
    expect(onStartIsSetChange).toHaveBeenCalledWith(true);
  });

  it("moves the start to the picked time", async () => {
    const onStartIsSetChange = jest.fn();
    renderTimeBar({ onStartIsSetChange });

    await clickButton("Time");
    await clickButton("10:00 am");
    await act(async () => {
      fireEvent.click(screen.getByRole("option", { name: "30 minutes" }));
    });

    expect(sydneyDatetime().getMinutes()).toBe(30);
    expect(onStartIsSetChange).toHaveBeenCalledWith(true);
  });

  it("sets the duration when the end is picked after the start", async () => {
    const onStartIsSetChange = jest.fn();
    renderTimeBar({ onStartIsSetChange });

    await clickButton("Time");
    await clickButtonAt("No end time", 0);
    await pickDay(16);

    expect(store.getState().filters.value.duration).toBe("1440");
    expect(onStartIsSetChange).toHaveBeenCalledWith(true);
  });

  it("drops the duration when the end is picked before the start", async () => {
    store.dispatch(setFilter({ key: "duration", value: "60" }));
    const onStartIsSetChange = jest.fn();
    renderTimeBar({ onStartIsSetChange });

    await clickButton("Time");
    await clickButtonAt("15th June", 1);
    await pickDay(14);

    expect(store.getState().filters.value.duration).toBeUndefined();
    expect(onStartIsSetChange).not.toHaveBeenCalled();
  });
});
