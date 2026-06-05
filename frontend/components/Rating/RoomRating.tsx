import { Divider, Typography } from "@mui/material";
import { Stack, useMediaQuery } from "@mui/system";

import ReviewButton from "./ReviewButton";
import RoomRatingList from "./RoomRatingList";

interface RoomRatingProps {
  buildingID: string;
  roomID: string;
}

export default function RoomRating({ buildingID, roomID }: RoomRatingProps) {
  const isDesktop = useMediaQuery("(min-width: 675px)");

  return (
    <Stack
      sx={{
        alignSelf: "start",
        width: "100%",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          marginTop: 3,
        }}
      >
        Room Ratings
      </Typography>
      {isDesktop ? (
        <Stack
          direction="row"
          sx={{
            gap: 2,
          }}
        >
          <RoomRatingList roomID={roomID} />
          <Divider flexItem orientation="vertical" />
          <Stack
            sx={{
              gap: 1,
              justifyContent: "center",
            }}
          >
            <Typography>Share your thoughts on this room!</Typography>
            <ReviewButton buildingID={buildingID} roomID={roomID} />
          </Stack>
        </Stack>
      ) : (
        <Stack
          sx={{
            gap: 2,
            justifySelf: "center",
          }}
        >
          <RoomRatingList roomID={roomID} />
          <ReviewButton buildingID={buildingID} roomID={roomID} />
        </Stack>
      )}
    </Stack>
  );
}
