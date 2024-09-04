import LinearProgress from "@mui/material/LinearProgress";
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface LinearRatingProps {
  value: number;
}

const LinearRating: React.FC<LinearRatingProps> = ({ value }) => {
  return (
    <Box display="flex" alignItems="center">
      <Typography variant="body1" sx={{ marginRight: "8px" }}>
        {`${Math.round(value)}`}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={100}
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
