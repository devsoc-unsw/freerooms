import { SearchResponseValue } from "@common/types";
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { RoomAvailabilityBoxProps } from "views/RoomAvailabilityBox";

import RoomAvailability from "./RoomAvailability";

type AllRoomsRoomProps = SearchResponseValue &
  Pick<RoomAvailabilityBoxProps, "roomNumber">;

const Room: React.FC<AllRoomsRoomProps> = ({
  name,
  roomNumber,
  ...roomStatus
}) => {
  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: "#ffffff",
        marginBottom: 1,
        marginX: 1,
        overflow: "visible",
      }}
    >
      <CardActionArea href={`/room/${roomNumber}`}>
        <CardContent>
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            paddingX={1}
          >
            <Stack>
              <Typography
                sx={{
                  fontWeight: "bold",
                }}
              >
                {name}
              </Typography>
            </Stack>
            <RoomAvailability roomStatus={roomStatus} />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Room;
