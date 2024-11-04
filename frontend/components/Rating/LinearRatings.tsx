import { Box, Stack, Typography } from "@mui/material";
import React from "react";

import LinearRating from "./LinearRating";

const LinearRatings = () => {
  return (
    <Stack height="50%" width="100%">
      <Stack aria-label="Linear Ratings" gap={2} width="100%">
        <Box>
          <Typography variant="subtitle1" fontWeight={500}>
            Cleanliness
          </Typography>
          <LinearRating value={4.8} />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={500}>
            Quietness
          </Typography>
          <LinearRating value={4.2} />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={500}>
            Location
          </Typography>
          <LinearRating value={4.5} />
        </Box>
      </Stack>
    </Stack>
  );
};

export default LinearRatings;
