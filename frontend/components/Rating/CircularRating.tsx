import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import React from "react";

interface CircularRatingProps {
  category: string;
  rating: number;
}

const CircularRating: React.FC<CircularRatingProps> = ({
  category,
  rating,
}) => {
  const normalizedRating = 100 - (rating / 5) * 100;

  return (
    <Box textAlign="center" mx={1}>
      <Typography variant="subtitle1" fontWeight={500}>
        {category}
      </Typography>
      <Box
        sx={{
          alignItems: "center",
          display: "inline-flex",
          justifyContent: "center",
          margin: "0 auto",
          position: "relative",
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
            left: "50%",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h5">{rating.toFixed(1)}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CircularRating;
