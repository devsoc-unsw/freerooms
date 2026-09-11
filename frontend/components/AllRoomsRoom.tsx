import { SearchResponseValue } from "@common/types";
import getRoomHref from "@frontend/utils/getRoomHref";
import {
  Card,
  CardActionArea,
  CardContent,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { RoomAvailabilityBoxProps } from "views/RoomAvailabilityBox";

import RoomAvailability from "./RoomAvailability";

type LoadingProps = { loading: true };

type LoadedProps = SearchResponseValue &
  Pick<RoomAvailabilityBoxProps, "roomNumber" | "date"> & { loading?: false };

type AllRoomsRoomProps = LoadingProps | LoadedProps;

const rowSx = {
  alignItems: "center",
  height: "40px",
  justifyContent: "space-between",
  paddingLeft: 1,
  paddingRight: 1,
} as const;

const Room: React.FC<AllRoomsRoomProps> = (props) => {
  const theme = useTheme();

  const cardSx = {
    backgroundColor: theme.palette.background.default,
    marginTop: 1,
    overflow: "visible",
  };

  if (props.loading) {
    return (
      <Skeleton
        animation="wave"
        variant="rounded"
        width="100%"
        height={72}
        sx={{ marginTop: 1, flexShrink: 0 }}
      />
    );
  }

  const { name, roomNumber, date, status, endtime } = props;
  const roomStatus = { status, endtime };
  const roomHref = getRoomHref(roomNumber, date);

  return (
    <Card variant="outlined" sx={cardSx}>
      <CardActionArea href={roomHref} target="_blank">
        <CardContent>
          <Stack direction="row" spacing={1} sx={rowSx}>
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
