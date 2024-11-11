import { Rating } from "@common/types";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Modal,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import setInsertRating from "hooks/setInsertRating";
import React, { useState } from "react";

import ReviewRating from "./ReviewRating";

interface ReviewModalProps {
  buildingID: string;
  open: boolean;
  roomID: string;
  handleClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  buildingID,
  open,
  roomID,
  handleClose,
}) => {
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

  const handleSubmit = () => {
    // prevent default submission
    if (
      cleanlinesRating === 0 &&
      locationRating === 0 &&
      quietnessRating === 0 &&
      overallRating === 0
    ) {
      return;
    }

    const newRating: Rating = {
      cleanliness: cleanlinesRating,
      location: locationRating,
      quietness: quietnessRating,
      overall: overallRating,
    };

    setInsertRating(roomID, buildingID, newRating);
    setShowSnackbar(true);
    handleClose();
  };

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

  const handleSnackbarClose = () => {
    setShowSnackbar(false);
  };

  return (
    <>
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
              <ReviewRating
                category="Cleanliness"
                ratingCallback={ratingCallback}
              />
              <ReviewRating
                category="Location"
                ratingCallback={ratingCallback}
              />
              <ReviewRating
                category="Quietness"
                ratingCallback={ratingCallback}
              />
              <ReviewRating
                category="Overall"
                ratingCallback={ratingCallback}
              />
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
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={5000}
        open={showSnackbar}
        onClose={() => setShowSnackbar(false)}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Thank you for your rating!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ReviewModal;
