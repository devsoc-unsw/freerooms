import "@testing-library/jest-dom";

import { RoomStatus } from "@common/types";
import { useMediaQuery } from "@mui/material";
import { screen } from "@testing-library/react";
import { useParams, useRouter } from "next/navigation";
import { Provider } from "react-redux";

import Page from "@frontend/app/room/[room]/page";
import BuildingCard from "@frontend/components/rooms/BuildingCard";
import { useDispatch, useSelector } from "@frontend/redux/hooks";
import store from "@frontend/redux/store";
import RoomAvailabilityBox from "@frontend/views/RoomAvailabilityBox";
import renderWithRedux from "@frontend/__tests__/utils/renderWithRedux";
import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithRedux";

// Mock DarkModeContext to avoid test failing due to importing NuqsAdapter
jest.mock("@frontend/app/clientLayout", () => ({
  DarkModeContext: require("react").createContext({
    isDarkMode: false,
    toggleDarkMode: () => {},
  }),
}));

jest.mock("nuqs", () => ({
  useQueryStates: (keys: Record<string, { defaultValue: string }>) => [
    Object.fromEntries(
      Object.entries(keys).map(([key, options]) => [key, options.defaultValue])
    ),
    jest.fn(),
  ],
  parseAsString: {
    withDefault: (defaultValue: string) => ({ defaultValue }),
  },
}));

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));

jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn().mockReturnValue(false),
}));

jest.mock("@frontend/hooks/useBuilding", () => ({
  __esModule: true,
  default: (buildingId: string) => {
    return {
      building: { id: buildingId, name: "Ainsworth" },
      error: null,
    };
  },
}));

jest.mock("@frontend/hooks/useRoom", () => ({
  __esModule: true,
  default: (roomId: string) => {
    return {
      room: {
        name: "Ainsworth 101",
        id: "K-J17-101",
        abbr: "Ainswth101",
        capacity: 50,
        usage: "TUSM",
        school: " ",
      },
      error: null,
    };
  },
}));

describe("Rating Star", () => {
  it("Star shows up on buildings card (non-mobile)", () => {
    renderWithRedux(<BuildingCard buildingId="K-J17" />);

    const starIcon = screen.getByLabelText(/star-info/i);
    expect(starIcon).toBeInTheDocument();
  });

  it("Star shows up on buildings card (mobile)", () => {
    (useMediaQuery as unknown as jest.Mock).mockReturnValue(true);
    renderWithRedux(<BuildingCard buildingId="K-J17" />);

    const starIcon = screen.getByLabelText(/star-info/i);
    expect(starIcon).toBeInTheDocument();
  });

  it("Stars show up on building drawer", () => {
    const roomStat: RoomStatus = {
      status: "free",
      endtime: "",
    };

    renderWithRedux(
      <RoomAvailabilityBox
        roomNumber="101"
        roomStatus={roomStat}
        buildingId="K-J17"
      />
    );

    const starIcon = screen.getByLabelText(/5-star-info/i);
    expect(starIcon).toBeInTheDocument();
  });

  it("Stars show up on the room page", () => {
    const router = { back: jest.fn() };

    (useRouter as jest.Mock).mockReturnValue(router);
    (useParams as jest.Mock).mockReturnValue({ room: "K-J17-101" });

    render(
      <Provider store={store}>
        <Page />
      </Provider>
    );

    const starInfo = screen.getByLabelText(/5-star-info/i);
    expect(starInfo).toBeInTheDocument();
  });
});
