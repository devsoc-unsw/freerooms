import Box from "@mui/material/Box";
import React from "react";

import CircularRating from "./CircularRating";

const RoomRatingList = () => {
  return (
    <Box display="flex" justifyContent="flex-start" mt={2} gap={9}>
      <CircularRating category="Cleanliness" rating={4} />
      <CircularRating category="Quietness" rating={3.5} />
      <CircularRating category="ACK" rating={5} />
    </Box>
  );
};

export default RoomRatingList;
