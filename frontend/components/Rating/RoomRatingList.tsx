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

  const cleanlinessRating = ratings.data
    ? ratings.data.averageRating.cleanliness
    : 0;
  const locationRating = ratings.data ? ratings.data.averageRating.location : 0;
  const quietnessRating = ratings.data
    ? ratings.data.averageRating.quietness
    : 0;

  return (
    <>
      {isDesktop ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: 2,
          }}
        >
          <Stack
            direction="row"
            sx={{
              alignItems: "center",
              gap: 4,
            }}
          >
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
        <Stack
          sx={{
            gap: 2,
            marginTop: 2,
            width: "100%",
          }}
        >
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
