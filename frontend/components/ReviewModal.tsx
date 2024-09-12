import { Box, Button, Modal, Stack } from "@mui/material";
import React, { useState } from "react";
import ReviewRating from "./ReviewRating";

interface ReviewModalProps {
  open: boolean;
  handleClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ open, handleClose }) => {
  const handleSubmit = () => {
    // insert future code to deal with submission of review
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
          <ReviewRating text="Quietness" />
          <ReviewRating text="Location" />
          <ReviewRating text="Cleanliness" />
          <ReviewRating text="Overall" />
          <Button
            onClick={handleSubmit}
            sx={{
              fontSize: "14px",
              color: "#1E90FF",
              "&:hover": {
                backgroundColor: "inherit",
                boxShadow: "none",
              },
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
