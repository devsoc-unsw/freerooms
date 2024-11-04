import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Stack,
  Typography,
} from "@mui/material";
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
          bgcolor: "white",
          borderRadius: "10px",
          left: "165%",
          position: "absolute",
          top: "160%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Stack>
          <IconButton
            aria-label="Close"
            onClick={handleClose}
            sx={{ alignSelf: "flex-end", margin: 1 }}
          >
            <CloseIcon />
          </IconButton>
          <Stack gap={3} marginBottom={4} paddingX={8}>
            <Typography variant="h6">Leave a Rating</Typography>
            <ReviewRating category="Quietness" />
            <ReviewRating category="Location" />
            <ReviewRating category="Cleanliness" />
            <ReviewRating category="Overall" />
            <Button
              variant="outlined"
              onClick={handleSubmit}
              sx={{ alignSelf: "center", marginTop: 1, width: 150 }}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ReviewModal;
