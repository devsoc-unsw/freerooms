import { renderWithTheme } from "@frontend/__tests__/utils/renderWithProviders";
import BottomSheet from "@frontend/components/map/BottomSheet";
import {
  FULL_RATIO,
  getReleaseStage,
  getStageHeight,
  getTapStage,
  getVisibleHeight,
  HALF_RATIO,
  PEEK_HEIGHT,
  SheetStage,
} from "@frontend/utils/bottomSheet";
import { fireEvent, screen } from "@testing-library/react";

const VIEWPORT = 800;

describe("bottom sheet snapping", () => {
  describe("getStageHeight", () => {
    it("uses fixed peek height and screen ratios for half and full", () => {
      expect(getStageHeight("peek", VIEWPORT)).toBe(PEEK_HEIGHT);
      expect(getStageHeight("half", VIEWPORT)).toBe(VIEWPORT * HALF_RATIO);
      expect(getStageHeight("full", VIEWPORT)).toBe(VIEWPORT * FULL_RATIO);
    });
  });

  describe("getVisibleHeight", () => {
    it("follows the drag", () => {
      expect(getVisibleHeight("half", 100, VIEWPORT)).toBe(
        VIEWPORT * HALF_RATIO - 100
      );
    });

    it("can't be dragged below peek or above full", () => {
      expect(getVisibleHeight("peek", 500, VIEWPORT)).toBe(PEEK_HEIGHT);
      expect(getVisibleHeight("full", -500, VIEWPORT)).toBe(
        VIEWPORT * FULL_RATIO
      );
    });
  });

  describe("getTapStage", () => {
    it("opens one stage per tap", () => {
      expect(getTapStage("peek")).toBe("half");
      expect(getTapStage("half")).toBe("full");
    });

    it("drops back to half from full, not all the way to peek", () => {
      expect(getTapStage("full")).toBe("half");
    });
  });

  describe("getReleaseStage", () => {
    const release = (stage: SheetStage, dragOffset: number, velocity = 0) =>
      getReleaseStage({
        stage,
        dragOffset,
        velocity,
        viewportHeight: VIEWPORT,
      });

    it("treats tiny movements as a tap", () => {
      expect(release("peek", 3)).toBe("half");
      expect(release("full", -2)).toBe("half");
    });

    it("snaps a slow drag to the nearest stage", () => {
      // half is 480px; dragging down 350px leaves 130px, nearest is peek (88)
      expect(release("half", 350, 0.1)).toBe("peek");
      // dragging up 200px leaves 680px, nearest is full (720)
      expect(release("half", -200, -0.1)).toBe("full");
      // a small slow drag settles back where it started
      expect(release("half", 40, 0.1)).toBe("half");
    });

    it("moves one stage on a quick flick, even over a short distance", () => {
      expect(release("half", 30, 1)).toBe("peek");
      expect(release("half", -30, -1)).toBe("full");
    });

    it("stays within the stages on a flick past the ends", () => {
      expect(release("peek", 30, 1)).toBe("peek");
      expect(release("full", -30, -1)).toBe("full");
    });
  });
});

// jsdom has no PointerEvent, so fireEvent would drop clientY without this
class TestPointerEvent extends MouseEvent {
  pointerId: number;

  constructor(type: string, init: PointerEventInit = {}) {
    super(type, init);
    this.pointerId = init.pointerId ?? 1;
  }
}

describe("BottomSheet", () => {
  let now = 0;

  beforeAll(() => {
    window.PointerEvent ??= TestPointerEvent as unknown as typeof PointerEvent;
  });

  beforeEach(() => {
    now = 0;
    jest.spyOn(Date, "now").mockImplementation(() => now);
    window.innerHeight = VIEWPORT;
    // jsdom doesn't implement pointer capture
    HTMLElement.prototype.setPointerCapture = jest.fn();
  });

  const renderSheet = (stage: SheetStage = "half") => {
    const onStageChange = jest.fn();
    renderWithTheme(
      <BottomSheet
        stage={stage}
        onStageChange={onStageChange}
        handleContent={
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
          >
            Close
          </button>
        }
      >
        <div>Rooms</div>
      </BottomSheet>
    );
    return { onStageChange, handle: screen.getByTestId("bottom-sheet-handle") };
  };

  it("snaps to the nearest stage after a slow drag", () => {
    const { onStageChange, handle } = renderSheet("half");

    fireEvent.pointerDown(handle, { clientY: 400 });
    // Several moves before React re-renders must all count
    fireEvent.pointerMove(handle, { clientY: 500 });
    fireEvent.pointerMove(handle, { clientY: 750 });
    now = 2000;
    fireEvent.pointerUp(handle, { clientY: 750 });

    expect(onStageChange).toHaveBeenCalledWith("peek");
  });

  it("moves one stage on a quick flick", () => {
    const { onStageChange, handle } = renderSheet("half");

    fireEvent.pointerDown(handle, { clientY: 400 });
    fireEvent.pointerMove(handle, { clientY: 360 });
    now = 40;
    fireEvent.pointerUp(handle, { clientY: 360 });

    expect(onStageChange).toHaveBeenCalledWith("full");
  });

  it("treats a press without movement as a tap", () => {
    const { onStageChange, handle } = renderSheet("full");

    fireEvent.pointerDown(handle, { clientY: 400 });
    now = 100;
    fireEvent.pointerUp(handle, { clientY: 400 });

    expect(onStageChange).toHaveBeenCalledWith("half");
  });

  it("stays on the current stage when the browser cancels the gesture", () => {
    const { onStageChange, handle } = renderSheet("half");

    fireEvent.pointerDown(handle, { clientY: 400 });
    fireEvent.pointerMove(handle, { clientY: 600 });
    fireEvent.pointerCancel(handle);
    fireEvent.pointerUp(handle, { clientY: 600 });

    expect(onStageChange).not.toHaveBeenCalled();
  });

  it("ignores presses on buttons inside the handle, like close", () => {
    const { onStageChange } = renderSheet("half");
    const close = screen.getByRole("button", { name: "Close" });

    fireEvent.pointerDown(close, { clientY: 400 });
    fireEvent.pointerUp(close, { clientY: 400 });

    expect(onStageChange).not.toHaveBeenCalled();
  });
});
