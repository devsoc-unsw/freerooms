import Box from "@mui/material/Box";
import { Stack, useMediaQuery } from "@mui/system";
import DecimalStarRating from "components/DecimalStarRating";
import useRoomRatings from "hooks/useRoomRatings";
import React from "react";

import CircularRating from "./CircularRating";
import LinearRating from "./LinearRating";

const RoomRatingList: React.FC<{
  roomID: string;
}> = ({ roomID }) => {
  const isDesktop = useMediaQuery("(min-width: 970px)");

  const ratings = useRoomRatings(roomID);

  let cleanlinessRating = ratings.data
    ? ratings.data.averageRating.cleanliness
    : 0;
  let locationRating = ratings.data
    ? ratings.data.averageRating.cleanliness
    : 0;
  let quietnessRating = ratings.data
    ? ratings.data.averageRating.cleanliness
    : 0;
  return (
    <>
      {isDesktop ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <Stack alignItems="center" direction="row" gap={4}>
            <DecimalStarRating roomID={roomID} />
            <Stack direction="row">
              <CircularRating
                category="Cleanliness"
                rating={cleanlinessRating}
              />
              <CircularRating category="Location" rating={locationRating} />
              <CircularRating category="Quietness" rating={quietnessRating} />
            </Stack>
          </Stack>
        </Box>
      ) : (
        <Stack gap={2} marginTop={2} width="100%">
          <DecimalStarRating roomID={roomID} />
          <LinearRating category="Cleanliness" value={cleanlinessRating} />
          <LinearRating category="Location" value={locationRating} />
          <LinearRating category="Quietness" value={quietnessRating} />
        </Stack>
      )}
    </>
  );
};

export default RoomRatingList;
