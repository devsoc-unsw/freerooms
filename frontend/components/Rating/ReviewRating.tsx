import { Rating, Stack, Typography } from "@mui/material";
import { DarkModeContext } from "app/clientLayout";
import React, { useContext } from "react";

interface ReviewRatingProps {
  category: string;
  ratingCallback: (reviewType: string, rating: number | null) => void;
}

const ReviewRating: React.FC<ReviewRatingProps> = ({
  category,
  ratingCallback,
}) => {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <Stack>
      <Typography id="modal-modal-title" variant="body1">
        {category}
      </Typography>
      <Rating
        name={category.toLowerCase()}
        defaultValue={0}
        onChange={(event, value) => ratingCallback(category, value)}
        size="large"
        sx={{
          "& .MuiRating-iconEmpty": {
            color: `${isDarkMode ? "#FFFFFF" : "#101214"} !important`,
          },
        }}
      />
    </Stack>
  );
};

export default ReviewRating;
