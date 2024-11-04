import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import OverallRating from "components/OverallRating";
import useRoomRatings from "hooks/useRoomRatings";
import React from "react";

import CircularRating from "./CircularRating";

const RoomRatingList: React.FC<{
  roomID: string;
}> = ({ roomID }) => {
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
    <Box display="flex" justifyContent="center" mt={2}>
      <Grid container spacing={{ xs: 1, sm: 2 }} columns={{ xs: 2, sm: 4 }}>
        <Grid size={1}>
          <OverallRating />
        </Grid>
        <Grid size={1}>
          <CircularRating category="Cleanliness" rating={cleanlinessRating} />
        </Grid>
        <Grid size={1}>
          <CircularRating category="Quietness" rating={quietnessRating} />
        </Grid>
        <Grid size={1}>
          <CircularRating category="Location" rating={locationRating} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RoomRatingList;
