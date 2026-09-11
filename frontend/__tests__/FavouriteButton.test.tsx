import "@testing-library/jest-dom";

import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithRedux";
import Page from "@frontend/app/room/[room]/page";
import store from "@frontend/redux/store";
import { fireEvent, screen } from "@testing-library/react";
import { useParams, useRouter } from "next/navigation";
import { Provider } from "react-redux";

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

describe("Favourite button", () => {
  beforeEach(() => {
    window.localStorage.clear();

    (useParams as jest.Mock).mockReturnValue({ room: "K-J17-101" });
    (useRouter as jest.Mock).mockReturnValue({ back: jest.fn() });
  });

  const renderRoomPage = () => {
    return render(
      <Provider store={store}>
        <Page />
      </Provider>
    );
  };

  test("shows add favourite button when the room is not favourited", () => {
    renderRoomPage();

    const favouriteIcon = screen.getByRole("button", {
      name: /Add as favourite/i,
    });
    expect(favouriteIcon).toBeInTheDocument();
  });

  test("shows remove favourite button when the room is not favourited", () => {
    renderRoomPage();

    fireEvent.click(screen.getByRole("button", { name: /Add as favourite/i })); // Trigger button click event.

    const removeFavouriteIcon = screen.getByRole("button", {
      name: /Remove as favourite/i,
    });
    expect(removeFavouriteIcon).toBeInTheDocument();
  });

  test("adds the room to localStorage when clicked", () => {
    renderRoomPage();

    fireEvent.click(screen.getByRole("button", { name: /Add as favourite/i }));

    const storedFavourites = JSON.parse(
      window.localStorage.getItem("favourite") ?? "[]"
    );
    expect(storedFavourites).toContain("K-J17-101");

    const removefavouriteIcon = screen.getByRole("button", {
      name: /Remove as favourite/i,
    });
    expect(removefavouriteIcon).toBeInTheDocument();
  });

  test("removes the room from localStorage when clicked again", () => {
    window.localStorage.setItem("favourite", JSON.stringify(["K-J17-101"]));

    renderRoomPage();

    fireEvent.click(
      screen.getByRole("button", { name: /Remove as favourite/i })
    );

    const storedFavourites = JSON.parse(
      window.localStorage.getItem("favourite") ?? "[]"
    );
    expect(storedFavourites).not.toContain("K-J17-101");

    const favouriteIcon = screen.getByRole("button", {
      name: /Add as favourite/i,
    });
    expect(favouriteIcon).toBeInTheDocument();
  });
});
