import Box from "@mui/material/Box";
import { Stack, useMediaQuery } from "@mui/system";
import DecimalStarRating from "components/DecimalStarRating";
import useRoomRatings from "hooks/useRoomRatings";
import React from "react";

import CircularRating from "./CircularRating";
import LinearRatings from "./LinearRatings";

const RoomRatingList: React.FC<{
  roomID: string;
}> = ({ roomID }) => {
  const isDesktop = useMediaQuery("(min-width: 970px)");

  const { ratings } = useRoomRatings(roomID);

  let cleanlinessRating = 0;
  let quietnessRating = 0;
  let locationRating = 0;
  let overallRating = 0;

  if (ratings && ratings.length > 0) {
    ratings.forEach((rating) => {
      cleanlinessRating += rating.cleanliness;
      quietnessRating += rating.cleanliness;
      locationRating += rating.location;
      overallRating += rating.overall;
    });

    cleanlinessRating = cleanlinessRating / ratings.length;
    quietnessRating = quietnessRating / ratings.length;
    locationRating = locationRating / ratings.length;
    overallRating = overallRating / ratings.length;
  }
  return (
    <>
      {isDesktop ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <Stack alignItems="center" direction="row" gap={4}>
            <DecimalStarRating />
            <Stack direction="row">
              <CircularRating
                category="Cleanliness"
                rating={cleanlinessRating}
              />
              <CircularRating category="Quietness" rating={quietnessRating} />
              <CircularRating category="Location" rating={locationRating} />
            </Stack>
          </Stack>
        </Box>
      ) : (
        <Stack gap={2} marginTop={2} width="100%">
          <DecimalStarRating />
          <LinearRatings />
        </Stack>
      )}
    </>
  );
};

export default RoomRatingList;
