import { Box, Button, Modal, Stack } from "@mui/material";
import React, { useState } from "react";

import ReviewRating from "./ReviewRating";
import useInsertRating from "hooks/useInsertRating";
import { Rating } from "@common/types";

interface ReviewModalProps {
  open: boolean;
  roomID: string;
  handleClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  open,
  roomID,
  handleClose,
}) => {
  const [quietnessRating, setQuienessRating] = useState(0);
  const [locationRating, setLocationRating] = useState(0);
  const [cleanlinesRating, setCleanlinessRating] = useState(0);
  const [overallRating, setOverallRating] = useState(0);

  const ratingCallback = (reviewType: string, rating: number | null) => {
    if (typeof rating === null) {
      return;
    } else if (reviewType === "Quietness") {
      setQuienessRating(rating!);
    } else if (reviewType === "Location") {
      setLocationRating(rating!);
    } else if (reviewType === "Cleanliness") {
      setCleanlinessRating(rating!);
    } else if (reviewType === "Overall") {
      setOverallRating(rating!);
    }
  };

  const handleSubmit = () => {
    const newRating: Rating = {
      quitness: quietnessRating,
      location: locationRating,
      cleanliness: cleanlinesRating,
      overall: overallRating,
    };

    console.log(newRating);
    useInsertRating(roomID, newRating);
    handleClose();
  };
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ height: "30%", width: "30%" }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "160%",
          left: "165%",
          transform: "translate(-50%, -50%)",
          width: "20vw",
          minWidth: "300px",
          bgcolor: "white",
          p: 4,
          borderRadius: "16px",
        }}
      >
        <Stack spacing={2} alignItems="center">
          <ReviewRating text="Quietness" ratingCallback={ratingCallback} />
          <ReviewRating text="Location" ratingCallback={ratingCallback} />
          <ReviewRating text="Cleanliness" ratingCallback={ratingCallback} />
          <ReviewRating text="Overall" ratingCallback={ratingCallback} />
          <Button
            onClick={handleSubmit}
            sx={{
              fontSize: "16px",
              color: "#1E90FF",
            }}
          >
            Submit
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ReviewModal;
