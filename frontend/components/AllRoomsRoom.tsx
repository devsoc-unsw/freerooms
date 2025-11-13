import { SearchResponseValue } from "@common/types";
import StarIcon from "@mui/icons-material/Star";
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import useRoomRatings from "hooks/useRoomRatings";
import { RoomAvailabilityBoxProps } from "views/RoomAvailabilityBox";

import roomPhotos from "../public/room-photos.json";
import RoomAvailability from "./RoomAvailability";

const StatusBox = styled(Box)<BoxProps>(() => ({
  display: "flex",
  alignItems: "center",
  borderRadius: 15,
  right: 0,
  backgroundColor: "white",
  padding: 8,
  paddingLeft: 10,
  paddingRight: 10,
  margin: 10,
}));

type AllRoomsRoomProps = SearchResponseValue &
  Pick<RoomAvailabilityBoxProps, "roomNumber">;

const Room: React.FC<AllRoomsRoomProps> = ({
  name,
  roomNumber,
  ...roomStatus
}) => {
  const theme = useTheme();
  const ratings = useRoomRatings(roomNumber);
  let overallRating = ratings.data ? ratings.data.overallRating : 0;

  const [campus, grid] = roomNumber.split("-");

  const roomPhoto =
    (roomPhotos as Record<string, string>)[roomNumber] ||
    `/assets/building_photos/${campus}-${grid}.webp`;

  return (
    <Card
      variant="outlined"
      sx={{
        backgroundColor: roomPhoto ? "transparent" : "#FDE7E1",
        backgroundImage: roomPhoto
          ? `linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2)), url(${roomPhoto})`
          : "none",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: roomPhoto ? "white" : theme.palette.text.primary,
        marginTop: 1,
        overflow: "visible",
        borderRadius: 2,
        transition: "all 0.1s ease-in-out",
        "&:hover": {
          cursor: "pointer",
          opacity: 0.9,
        },
      }}
    >
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

            <Stack direction="row" justifyContent="center">
              <StatusBox>
                <RoomAvailability roomStatus={roomStatus} />
              </StatusBox>

              <StatusBox>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  aria-label="star-info"
                  spacing={0.3}
                >
                  <Typography
                    sx={{ fontSize: 12, fontWeight: 500, color: "#000000" }}
                  >
                    {overallRating == 0 ? 0 : overallRating.toFixed(1)}
                  </Typography>

                  <StarIcon
                    sx={{ fontSize: "1rem", color: "rgb(255, 169, 12)" }}
                  />
                </Stack>
              </StatusBox>
            </Stack>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default Room;
