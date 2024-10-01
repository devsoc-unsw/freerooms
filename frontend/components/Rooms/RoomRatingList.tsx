import Box from "@mui/material/Box";
import useRoomRatings from "hooks/useRoomRatings";
import React from "react";

import CircularRating from "./CircularRating";

const RoomRatingList: React.FC<{
  roomID: string;
}> = ({ roomID }) => {
  const { ratings } = useRoomRatings(roomID);

  let cleanlinesRating = 0;
  let quietnessRating = 0;
  let ackRating = 0;

  if (ratings && ratings.length > 0) {
    ratings.forEach((rating) => {
      cleanlinesRating += rating.cleanliness;
      quietnessRating += rating.cleanliness;
      ackRating += rating.overall;
    });

    cleanlinesRating = cleanlinesRating / ratings.length;
    quietnessRating = quietnessRating / ratings.length;
    ackRating = ackRating / ratings.length;
  }

  return (
    <Box display="flex" justifyContent="flex-start" mt={2} gap={9}>
      <CircularRating category="Cleanliness" rating={cleanlinesRating} />
      <CircularRating category="Quietness" rating={quietnessRating} />
      <CircularRating category="ACK" rating={ackRating} />
    </Box>
  );
};

export default RoomRatingList;
