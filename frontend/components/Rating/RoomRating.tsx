import { Divider, Typography } from "@mui/material";
import { Stack, useMediaQuery } from "@mui/system";

import ReviewButton from "./ReviewButton";
import RoomRatingList from "./RoomRatingList";

interface RoomRatingProps {
  roomID: string;
}

export default function RoomRating({ roomID }: RoomRatingProps) {
  const isDesktop = useMediaQuery("(min-width: 675px)");

  return (
    <Stack alignSelf="start" width="100%">
      <Typography fontWeight="bold" marginTop={3} variant="h5">
        Room Ratings
      </Typography>
      {isDesktop ? (
        <Stack direction="row" gap={2}>
          <RoomRatingList roomID={roomID} />
          <Divider flexItem orientation="vertical" />
          <Stack gap={1} justifyContent="center">
            <Typography>Share your thoughts on this room!</Typography>
            <ReviewButton />
          </Stack>
        </Stack>
      ) : (
        <Stack gap={2} justifySelf="center">
          <RoomRatingList roomID={roomID} />
          <ReviewButton />
        </Stack>
      )}
    </Stack>
  );
}
