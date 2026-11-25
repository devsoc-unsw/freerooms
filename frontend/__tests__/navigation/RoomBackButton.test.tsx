import RoomBackButton from "@frontend/components/navigation/RoomBackButton";
import { useDispatch, useSelector } from "@frontend/redux/hooks";
import currentBuildingSlice from "@frontend/redux/slices/currentBuildingSlice";
import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { Provider } from "react-redux";

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn(),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

describe("RoomBackButton", () => {
  const router = { back: jest.fn(), push: jest.fn() };

  beforeEach(() => {
    router.back.mockClear();
    router.push.mockClear();
    (useSelector as unknown as jest.Mock).mockReturnValue({});
    (useDispatch as unknown as jest.Mock).mockReturnValue(jest.fn());
    (useRouter as unknown as jest.Mock).mockReturnValue(router);

    render(
      <Provider
        store={configureStore({
          reducer: { currentBuilding: currentBuildingSlice },
        })}
      >
        <RoomBackButton />
      </Provider>
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("back button appears on screen", () => {
    const backButton = screen.getByRole("button", { name: "back" });
    expect(backButton).toBeInTheDocument();
  });

  test("goes back when there is a page to go back to", () => {
    jest.spyOn(window.history, "length", "get").mockReturnValue(2);

    fireEvent.click(screen.getByRole("button", { name: "back" }));

    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.push).not.toHaveBeenCalled();
  });

  test("goes to Browse when the room was opened directly", () => {
    fireEvent.click(screen.getByRole("button", { name: "back" }));

    expect(router.push).toHaveBeenCalledWith("/browse");
    expect(router.back).not.toHaveBeenCalled();
  });
});
