import Box, { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import React, { useRef, useState } from "react";
import { useWindowSize } from "usehooks-ts";

export type SheetStage = "peek" | "half" | "full";

const STAGES: SheetStage[] = ["peek", "half", "full"];

// Height of the handle area (puller + peek row) shown when collapsed
const PEEK_HEIGHT = 88;
const HALF_RATIO = 0.6;
const FULL_RATIO = 0.9;

// Movement under this many pixels counts as a tap rather than a drag
const TAP_THRESHOLD = 5;

const stageHeight = (stage: SheetStage, viewportHeight: number) => {
  switch (stage) {
    case "peek":
      return PEEK_HEIGHT;
    case "half":
      return viewportHeight * HALF_RATIO;
    case "full":
      return viewportHeight * FULL_RATIO;
  }
};

const SheetContainer = styled(Box)<BoxProps>(({ theme }) => ({
  position: "fixed",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: theme.zIndex.drawer,
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.background.default,
  borderTopLeftRadius: theme.radius.landing,
  borderTopRightRadius: theme.radius.landing,
  boxShadow: theme.shadows[8],
}));

const Handle = styled(Box)<BoxProps>(() => ({
  flexShrink: 0,
  // Stop the browser scrolling the page while the sheet is dragged
  touchAction: "none",
  cursor: "grab",
}));

const Puller = styled(Box)<BoxProps>(({ theme }) => ({
  width: 32,
  height: 4,
  borderRadius: theme.radius.pill,
  backgroundColor: theme.colours.text.secondary,
  margin: `${theme.space.sm}px auto`,
}));

type BottomSheetProps = {
  stage: SheetStage;
  onStageChange: (stage: SheetStage) => void;
  // Always visible, even when collapsed
  handleContent: React.ReactNode;
  // Revealed as the sheet is pulled up
  children: React.ReactNode;
};

// Mobile bottom sheet that snaps between peek, half and full heights
const BottomSheet: React.FC<BottomSheetProps> = ({
  stage,
  onStageChange,
  handleContent,
  children,
}) => {
  const { height: viewportHeight } = useWindowSize();

  // How far the sheet has been dragged (px, positive = down), null when idle
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const startY = useRef(0);

  const fullHeight = stageHeight("full", viewportHeight);
  const visibleHeight = Math.min(
    fullHeight,
    Math.max(
      PEEK_HEIGHT,
      stageHeight(stage, viewportHeight) - (dragOffset ?? 0)
    )
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    startY.current = event.clientY;
    setDragOffset(0);
    // Keep receiving move events even if the pointer leaves the handle
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragOffset === null) {
      return;
    }

    setDragOffset(event.clientY - startY.current);
  };

  const onPointerUp = () => {
    if (dragOffset === null) {
      return;
    }

    if (Math.abs(dragOffset) < TAP_THRESHOLD) {
      // Tap steps up a stage, wrapping from full back to peek
      onStageChange(STAGES[(STAGES.indexOf(stage) + 1) % STAGES.length]);
    } else {
      // Drag snaps to whichever stage is closest to where it was released
      const nearest = STAGES.reduce((best, current) =>
        Math.abs(stageHeight(current, viewportHeight) - visibleHeight) <
        Math.abs(stageHeight(best, viewportHeight) - visibleHeight)
          ? current
          : best
      );
      onStageChange(nearest);
    }

    setDragOffset(null);
  };

  return (
    <SheetContainer
      sx={{
        height: fullHeight,
        // Always full height, moved down so only visibleHeight is on screen
        transform: `translateY(${fullHeight - visibleHeight}px)`,
        transition: dragOffset === null ? "transform 250ms ease-out" : "none",
      }}
    >
      <Handle
        // Full peek height only when collapsed, otherwise just fit the puller
        sx={{ height: stage === "peek" ? PEEK_HEIGHT : "auto" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Puller />
        {handleContent}
      </Handle>

      {/* Only scroll once fully open, so dragging and scrolling don't fight */}
      <Box sx={{ flex: 1, overflowY: stage === "full" ? "auto" : "hidden" }}>
        {children}
      </Box>
    </SheetContainer>
  );
};

export default BottomSheet;
