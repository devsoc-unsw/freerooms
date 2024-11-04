import CloseIcon from "@mui/icons-material/Close";
import { Box, Button, Modal, Stack } from "@mui/material";
import React from "react";

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
          borderRadius: "16px",
        }}
      >
        <Stack sx={{ alignItems: "flex-end" }}>
          <Button
            onClick={handleClose}
            sx={{
              minHeight: 0,
              minWidth: "32px",
              borderRadius: "10px",
              fontWeight: "bold",
              m: 1,
            }}
          >
            <CloseIcon />
          </Button>
        </Stack>
        <Stack
          spacing={2}
          sx={{
            alignItems: "center",
            px: 4,
            pb: 4,
          }}
        >
          <ReviewRating text="Quietness" />
          <ReviewRating text="Location" />
          <ReviewRating text="Cleanliness" />
          <ReviewRating text="Overall" />
          <Button
            variant="outlined"
            onClick={handleSubmit}
            sx={{
              fontSize: "16px",
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
