import renderWithRedux from "@frontend/__tests__/utils/renderWithProviders";
import BuildingDrawer from "@frontend/components/map/BuildingDrawer";
import { fireEvent, screen } from "@testing-library/react";

jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: jest.fn(),
}));
// Mobile layout, so the drawer renders as the bottom sheet
jest.mock("@mui/material", () => ({
  ...jest.requireActual("@mui/material"),
  useMediaQuery: jest.fn().mockReturnValue(true),
}));
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

const building = {
  name: "Ainsworth",
  id: "K-J17",
  lat: -33.918527,
  long: 151.23126,
  aliases: [],
};

const preloadedState = {
  currentBuilding: {
    value: building,
  },
};

// jsdom has no PointerEvent, so fireEvent would drop clientY without this
class TestPointerEvent extends MouseEvent {
  pointerId: number;

  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 1;
  }
}

// Slowly drag the sheet from half all the way down so it snaps to peek
const collapseToPeek = (now: { value: number }) => {
  const handle = screen.getByTestId("bottom-sheet-handle");
  fireEvent.pointerDown(handle, { clientY: 300 });
  fireEvent.pointerMove(handle, { clientY: 900 });
  now.value = 2000;
  fireEvent.pointerUp(handle, { clientY: 900 });
};

describe("BuildingDrawer mobile bottom sheet", () => {
  const now = { value: 0 };

  beforeAll(() => {
    window.PointerEvent ??= TestPointerEvent as unknown as typeof PointerEvent;
  });

  beforeEach(() => {
    now.value = 0;
    jest.spyOn(Date, "now").mockImplementation(() => now.value);
    window.innerHeight = 800;
    HTMLElement.prototype.setPointerCapture = jest.fn();
  });

  it("opens at half with the building details and a single close button", () => {
    renderWithRedux(<BuildingDrawer />, { preloadedState });

    expect(screen.getByAltText(/Image of building K-J17/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Close" })).toHaveLength(1);
  });

  it("hides the building details at peek, leaving one close button", () => {
    renderWithRedux(<BuildingDrawer distance={668} duration={480} />, {
      preloadedState,
    });

    collapseToPeek(now);

    expect(
      screen.queryByAltText(/Image of building K-J17/i)
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Close" })).toHaveLength(1);
    expect(screen.getByText("7–12 min")).toBeInTheDocument();
  });

  it("shows skeletons at peek while the route is loading", () => {
    renderWithRedux(
      <BuildingDrawer distance={668} duration={480} isDirectionsLoading />,
      { preloadedState }
    );

    collapseToPeek(now);

    expect(screen.getAllByTestId("walking-skeleton")).toHaveLength(2);
    expect(screen.queryByText("7–12 min")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });
});
