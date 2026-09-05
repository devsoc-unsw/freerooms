import { SearchResponseValue } from "@common/types";
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { RoomAvailabilityBoxProps } from "views/RoomAvailabilityBox";

import RoomAvailability from "./RoomAvailability";
import getRoomHref from "@frontend/utils/getRoomHref";

type AllRoomsRoomProps = SearchResponseValue &
  Pick<RoomAvailabilityBoxProps, "roomNumber" | "date">;

const Room: React.FC<AllRoomsRoomProps> = ({
  name,
  roomNumber,
  date,
  ...roomStatus
}) => {
  const theme = useTheme();
  const roomHref = getRoomHref(roomNumber, date);

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: theme.palette.background.default,
        marginTop: 1,
        overflow: "visible",
      }}
    >
      <CardActionArea href={roomHref} target="_blank">
        <CardContent>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
              height: "40px",
              justifyContent: "space-between",
              paddingLeft: 1,
              paddingRight: 1,
            }}
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
