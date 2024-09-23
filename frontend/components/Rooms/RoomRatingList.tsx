import Box from "@mui/material/Box";
import React from "react";

import CircularRating from "./CircularRating";
import useRoomRatings from "hooks/useRoomRatings";

const RoomRatingList: React.FC<{
  roomID: string;
}> = ({ roomID }) => {
  console.log("building name", roomID);
  const { ratings } = useRoomRatings(roomID);

  let cleanlinesRating = 0;
  let quietnessRating = 0;
  let ackRating = 0;

  if (ratings) {
    let cleanlinesRatingSum = 0;
    let quietnessRatingSum = 0;
    let ackRatingSum = 0;

    ratings.forEach((rating) => {
      cleanlinesRatingSum += rating.ratings[0];
      quietnessRatingSum += rating.ratings[1];
      ackRatingSum += rating.ratings[2];
    });

    cleanlinesRating = cleanlinesRatingSum / ratings.length;
    quietnessRating = quietnessRatingSum / ratings.length;
    ackRating = ackRatingSum / ratings.length;
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
