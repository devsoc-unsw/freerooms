import "@testing-library/jest-dom";

import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import currentBuildingSlice from "../redux/currentBuildingSlice";
import RoomBackButton from "../components/RoomBackButton";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "../redux/hooks";

// used BuildingDrawer.test as reference
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
  const router = { back: jest.fn() };

  beforeEach(() => {
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

  test("back button appears on screen", () => {
    const backButton = screen.getByRole("button", { name: "back" });
    expect(backButton).toBeInTheDocument();
  });

  test("back button works", () => {
    const backButton = screen.getByRole("button", { name: "back" });
    fireEvent.click(backButton);
    expect(router.back).toHaveBeenCalled();
  });
});
