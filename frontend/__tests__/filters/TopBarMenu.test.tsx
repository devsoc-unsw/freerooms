import { renderWithTheme as render } from "@frontend/__tests__/utils/renderWithProviders";
import SortBar from "@frontend/components/filters/SortBar";
import useMediaQuery from "@mui/material/useMediaQuery";
import { act, fireEvent, screen } from "@testing-library/react";

jest.mock("@mui/material/useMediaQuery", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseMediaQuery = useMediaQuery as unknown as jest.Mock;

const openSortMenu = async () => {
  await act(async () => {
    fireEvent.click(screen.getByRole("button", { name: "Sort" }));
  });
};

describe("TopBarMenu", () => {
  it("drops down from its button on larger screens", async () => {
    mockUseMediaQuery.mockReturnValue(false);
    render(<SortBar sort="alphabetical" setSort={jest.fn()} />);

    await openSortMenu();

    expect(screen.getByText("Reverse Alphabetical")).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens as a bottom sheet on phones", async () => {
    mockUseMediaQuery.mockReturnValue(true);
    render(<SortBar sort="alphabetical" setSort={jest.fn()} />);

    await openSortMenu();

    expect(screen.getByRole("dialog")).toHaveTextContent(
      "Reverse Alphabetical"
    );
  });
});
