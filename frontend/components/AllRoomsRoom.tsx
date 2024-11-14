import { SearchResponseValue } from "@common/types";
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
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
    <StyledRoomCard variant="outlined">
      <CardActionArea href={`/room/${roomNumber}`} target="_blank">
        <CardContent>
          <Stack
            alignItems="center"
            direction="row"
            height="40px"
            justifyContent="space-between"
            paddingX={1}
            spacing={1}
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
    </StyledRoomCard>
  );
};

const StyledRoomCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  marginTop: 1,
  overflow: "visible",
}));

export default Room;
