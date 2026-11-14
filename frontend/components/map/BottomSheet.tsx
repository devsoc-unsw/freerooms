import {
  getReleaseStage,
  getStageHeight,
  getVisibleHeight,
  PEEK_HEIGHT,
  SheetStage,
} from "@frontend/utils/bottomSheet";
import Box, { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import React, { useRef, useState } from "react";
import { useWindowSize } from "usehooks-ts";

export type { SheetStage } from "@frontend/utils/bottomSheet";

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
  handleContent: React.ReactNode;
  children: React.ReactNode;
};

type DragState = {
  offset: number;
  viewportHeight: number;
};

// Mobile bottom sheet that snaps between peek, half and full heights
const BottomSheet: React.FC<BottomSheetProps> = ({
  stage,
  onStageChange,
  handleContent,
  children,
}) => {
  const { height: windowHeight } = useWindowSize();

  const [drag, setDrag] = useState<DragState | null>(null);

  const dragRef = useRef<
    (DragState & { startY: number; startTime: number }) | null
  >(null);

  const viewportHeight = drag ? drag.viewportHeight : windowHeight;
  const fullHeight = getStageHeight("full", viewportHeight);
  const visibleHeight = getVisibleHeight(
    stage,
    drag?.offset ?? 0,
    viewportHeight
  );

  const endDrag = () => {
    dragRef.current = null;
    setDrag(null);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      offset: 0,
      viewportHeight: windowHeight,
      startY: event.clientY,
      startTime: Date.now(),
    };
    setDrag({ offset: 0, viewportHeight: windowHeight });
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = dragRef.current;
    if (!current) {
      return;
    }

    current.offset = event.clientY - current.startY;
    setDrag({ offset: current.offset, viewportHeight: current.viewportHeight });
  };

  const onPointerUp = () => {
    const current = dragRef.current;
    if (!current) {
      return;
    }

    const elapsed = Math.max(1, Date.now() - current.startTime);
    onStageChange(
      getReleaseStage({
        stage,
        dragOffset: current.offset,
        velocity: current.offset / elapsed,
        viewportHeight: current.viewportHeight,
      })
    );
    endDrag();
  };

  return (
    <SheetContainer
      data-testid="bottom-sheet"
      aria-label="building-drawer"
      sx={{
        height: fullHeight,
        transform: `translateY(${fullHeight - visibleHeight}px)`,
        transition: drag ? "none" : "transform 250ms ease-out",
      }}
    >
      <Handle
        data-testid="bottom-sheet-handle"
        sx={{ height: stage === "peek" ? PEEK_HEIGHT : "auto" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={endDrag}
      >
        <Puller />
        {handleContent}
      </Handle>

      <Box sx={{ flex: 1, overflowY: stage === "full" ? "auto" : "hidden" }}>
        {children}
      </Box>
    </SheetContainer>
  );
};

export default BottomSheet;
