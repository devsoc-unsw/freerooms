import "@testing-library/jest-dom";

import store from "@frontend/redux/store";
import { fireEvent, render, screen } from "@testing-library/react";
import { useParams, useRouter } from "next/navigation";
import { Provider } from "react-redux";

import Page from "../app/room/[room]/page";

jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
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

describe("Bookmark button", () => {
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

  test("shows add bookmark button when the room is not bookmarked", () => {
    renderRoomPage();

    const bookmarkIcon = screen.getByRole("button", {
      name: /add as bookmark/i,
    });
    expect(bookmarkIcon).toBeInTheDocument();
  });

  test("shows remove bookmark button when the room is not bookmarked", () => {
    renderRoomPage();

    fireEvent.click(screen.getByRole("button", { name: /add as bookmark/i })); // Trigger button click event.

    const removeBookmarkIcon = screen.getByRole("button", {
      name: /remove as bookmark/i,
    });
    expect(removeBookmarkIcon).toBeInTheDocument();
  });

  test("adds the room to localStorage when clicked", () => {
    renderRoomPage();

    fireEvent.click(screen.getByRole("button", { name: /add as bookmark/i }));

    const storedBookmarks = JSON.parse(
      window.localStorage.getItem("bookmark") ?? "[]"
    );
    expect(storedBookmarks).toContain("K-J17-101");

    const removeBookmarkIcon = screen.getByRole("button", {
      name: /remove as bookmark/i,
    });
    expect(removeBookmarkIcon).toBeInTheDocument();
  });

  test("removes the room from localStorage when clicked again", () => {
    window.localStorage.setItem("bookmark", JSON.stringify(["K-J17-101"]));

    renderRoomPage();

    fireEvent.click(
      screen.getByRole("button", { name: /remove as bookmark/i })
    );

    const storedBookmarks = JSON.parse(
      window.localStorage.getItem("bookmark") ?? "[]"
    );
    expect(storedBookmarks).not.toContain("K-J17-101");

    const bookmarkIcon = screen.getByRole("button", {
      name: /add as bookmark/i,
    });
    expect(bookmarkIcon).toBeInTheDocument();
  });
});
