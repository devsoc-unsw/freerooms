import RoomCard from "@frontend/components/rooms/RoomCard";
import { AppButton } from "@frontend/components/ui";
import AnimatedListItem from "@frontend/components/ui/AnimatedListItem";
import { Skeleton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import type { Room } from "common/types";
import { AnimatePresence } from "motion/react";
import { useState } from "react";

type RoomCardListProps = {
  rooms?: Room[];
  date?: string;
  emptyMessage?: string;
  pageSize?: number;
};

const CardGrid = styled("div")(({ theme }) => ({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr)",
  gap: theme.space.md,
  alignItems: "start",
  [theme.breakpoints.up("sm")]: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  },
  [theme.breakpoints.up("md")]: {
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  },
  "& > *": { minWidth: 0 },
}));

const EmptyState = styled(Typography)(({ theme }) => ({
  width: "100%",
  textAlign: "center",
  color: theme.colours.text.secondary,
  padding: `${theme.space.xxl}px 0`,
}));

const LoadMore = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  padding: `${theme.space.md}px 0`,
  "& button": {
    color: theme.colours.text.secondary,
    fontWeight: 500,
    fontSize: theme.typography.body2,
  },
}));

const RoomCardList: React.FC<RoomCardListProps> = ({
  rooms,
  date,
  emptyMessage = "No rooms to show.",
  pageSize,
}) => {
  const [visibleCount, setVisibleCount] = useState(pageSize ?? Infinity);
  if (!rooms) {
    return (
      <CardGrid>
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton
            key={index}
            animation="wave"
            variant="rounded"
            width="100%"
            sx={(theme) => ({
              height: theme.sizes.roomCard.height,
              [theme.breakpoints.down("sm")]: {
                height: theme.sizes.roomCard.compactHeight,
              },
            })}
          />
        ))}
      </CardGrid>
    );
  }

  if (rooms.length === 0) {
    return <EmptyState>{emptyMessage}</EmptyState>;
  }

  return (
    <>
      <CardGrid>
        <AnimatePresence initial={false} mode="popLayout">
          {rooms.slice(0, visibleCount).map((room) => (
            <AnimatedListItem key={room.id}>
              <RoomCard room={room} date={date} />
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </CardGrid>
      {pageSize && visibleCount < rooms.length && (
        <LoadMore>
          <AppButton
            variant="text"
            onClick={() => setVisibleCount((count) => count + pageSize)}
          >
            See more rooms
          </AppButton>
        </LoadMore>
      )}
    </>
  );
};

export default RoomCardList;
