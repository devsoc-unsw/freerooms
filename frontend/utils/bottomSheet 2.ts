/**
 * Snapping logic for the mobile building bottom sheet
 */

export type SheetStage = "peek" | "half" | "full";

export const SHEET_STAGES: SheetStage[] = ["peek", "half", "full"];

// Height of the handle area (puller + peek row) shown when collapsed
export const PEEK_HEIGHT = 88;
export const HALF_RATIO = 0.6;
export const FULL_RATIO = 0.9;

// Movement under this many pixels counts as a tap rather than a drag
export const TAP_THRESHOLD = 5;

// Releasing faster than this (px per ms) moves one stage in that direction
export const FLICK_VELOCITY = 0.5;

export const getStageHeight = (
  stage: SheetStage,
  viewportHeight: number
): number => {
  switch (stage) {
    case "peek":
      return PEEK_HEIGHT;
    case "half":
      return viewportHeight * HALF_RATIO;
    case "full":
      return viewportHeight * FULL_RATIO;
  }
};

// Visible height while dragging (positive offset = dragged down), kept between peek and full
export const getVisibleHeight = (
  stage: SheetStage,
  dragOffset: number,
  viewportHeight: number
): number =>
  Math.min(
    getStageHeight("full", viewportHeight),
    Math.max(PEEK_HEIGHT, getStageHeight(stage, viewportHeight) - dragOffset)
  );

// Tapping opens the sheet further; at full it drops back to half, never all the way to peek
export const getTapStage = (stage: SheetStage): SheetStage =>
  stage === "peek" ? "half" : stage === "half" ? "full" : "half";

const stepStage = (stage: SheetStage, direction: 1 | -1): SheetStage => {
  const index = SHEET_STAGES.indexOf(stage) + direction;
  return SHEET_STAGES[Math.min(SHEET_STAGES.length - 1, Math.max(0, index))];
};

const getNearestStage = (
  visibleHeight: number,
  viewportHeight: number
): SheetStage =>
  SHEET_STAGES.reduce((best, current) =>
    Math.abs(getStageHeight(current, viewportHeight) - visibleHeight) <
    Math.abs(getStageHeight(best, viewportHeight) - visibleHeight)
      ? current
      : best
  );

type ReleaseArguments = {
  stage: SheetStage;
  // Total distance dragged (px, positive = down)
  dragOffset: number;
  // Average speed of the drag (px per ms, positive = down)
  velocity: number;
  viewportHeight: number;
};

// Which stage the sheet settles on when the pointer is released
export const getReleaseStage = ({
  stage,
  dragOffset,
  velocity,
  viewportHeight,
}: ReleaseArguments): SheetStage => {
  if (Math.abs(dragOffset) < TAP_THRESHOLD) {
    return getTapStage(stage);
  }

  // A quick flick moves one stage even if it didn't travel far
  if (Math.abs(velocity) >= FLICK_VELOCITY) {
    return stepStage(stage, velocity > 0 ? -1 : 1);
  }

  return getNearestStage(
    getVisibleHeight(stage, dragOffset, viewportHeight),
    viewportHeight
  );
};
