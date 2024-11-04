import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import React from "react";

interface LinearRatingProps {
  value: number;
}

const LinearRating: React.FC<LinearRatingProps> = ({ value }) => {
  // Since ratings are out of 5 while LinearProgress is out of 100, multiply by 20
  const progress = value * 20;

  return (
    <Box display="flex" alignItems="center">
      <Typography variant="body1" sx={{ marginRight: "8px" }}>
        {value.toFixed(1)}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: "8px",
          borderRadius: "4px",
          flexGrow: 1,
          "& .MuiLinearProgress-bar": {
            borderRadius: "4px",
          },
        }}
      />
    </Box>
  );
};

export default LinearRating;
