import LinearProgress from "@mui/material/LinearProgress";
import React from "react";

const LinearRating = () => {
  return (
    <LinearProgress
      variant="determinate"
      sx={{
        height: "8px",
        borderRadius: "4px",
        "& .MuiLinearProgress-bar": {
          borderRadius: "4px",
        },
      }}
    />
  );
};

export default LinearRating;
