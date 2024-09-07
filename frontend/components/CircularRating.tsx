import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import React from "react";

interface CircularRatingProps {
  category: string;
  rating: number;
}

const CircularRating: React.FC<CircularRatingProps> = ({ category, rating }) => {
  const normalizedRating = 100 - (rating / 5) * 100;

  return (
    <Box textAlign="center" mx={1}>
      <Typography variant="h6" fontWeight="bold">
        {category}
      </Typography>
      <Box
        sx={{
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto",
        }}
      >
        <CircularProgress
          variant="determinate"
          value={100}
          size={100}
          thickness={3}
          sx={{
            color: "#f57c00",
            position: "absolute",
          }}
        />
        <CircularProgress
          variant="determinate"
          value={normalizedRating}
          size={100}
          thickness={3}
          sx={{
            color: "#e0e0e0",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h4">{rating}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CircularRating;
