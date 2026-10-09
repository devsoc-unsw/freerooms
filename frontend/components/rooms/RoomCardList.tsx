import type { Room } from "@common/types";
import RoomCard from "@frontend/components/rooms/RoomCard";
import {
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";


type RoomCardListProps = {
  rooms?: Room[];
  date?: string;
};

const CardGrid = styled("div")(({ theme }) => ({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: theme.spacing(2.5),
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
            height={300}
          />
        ))}
      </CardGrid>
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