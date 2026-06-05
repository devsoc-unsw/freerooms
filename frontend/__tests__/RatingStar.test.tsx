import "@testing-library/jest-dom";

import { RoomStatus } from "@common/types";
import { useMediaQuery } from "@mui/material";
import { render, screen } from "@testing-library/react";
import { useParams, useRouter } from "next/navigation";
import { Provider } from "react-redux";

import Page from "../app/room/[room]/page";
import BuildingCard from "../components/BuildingCard";
import { useDispatch, useSelector } from "../redux/hooks";
import store from "../redux/store";
import RoomAvailabilityBox from "../views/RoomAvailabilityBox";
import renderWithRedux from "./utils/renderWithRedux";

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

jest.mock("../hooks/useBuilding", () => ({
  __esModule: true,
  default: (buildingId: string) => {
    return {
      building: { id: buildingId, name: "Ainsworth" },
      error: null,
    };
  },
}));

jest.mock("../hooks/useRoom", () => ({
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
