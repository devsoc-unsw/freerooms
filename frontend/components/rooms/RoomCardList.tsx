import type { Room } from "@common/types";
import RoomCard from "@frontend/components/rooms/RoomCard";
import { Skeleton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

type RoomCardListProps = {
  rooms?: Room[];
  date?: string;
};

const CardGrid = styled("div")(({ theme }) => ({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: theme.space.md,
  [theme.breakpoints.up("sm")]: { gridTemplateColumns: "repeat(2, 1fr)" },
  [theme.breakpoints.up("md")]: { gridTemplateColumns: "repeat(3, 1fr)" },
}));

const EmptyState = styled(Typography)(({ theme }) => ({
  width: "100%",
  textAlign: "center",
  color: theme.colours.text.secondary,
  padding: `${theme.space.xxl}px 0`,
}));

const RoomCardList: React.FC<RoomCardListProps> = ({ rooms, date }) => {
  if (!rooms) {
    return (
      <CardGrid>
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton
            key={index}
            animation="wave"
            variant="rounded"
            width="100%"
            sx={(theme) => ({ height: theme.sizes.roomCard.height })}
          />
        ))}
      </CardGrid>
    );
  }

  if (rooms.length === 0) {
    return (
      <EmptyState>
        No rooms to show.
      </EmptyState>
    );
  }

  return (
    <CardGrid>
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} date={date} />
      ))}
    </CardGrid>
  );
};

export default RoomCardList;
