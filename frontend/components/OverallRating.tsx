import { Box, Button, Modal } from "@mui/material";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import Stack from "@mui/system/Stack";
import React, { useState } from "react";

import LinearRating from "./LinearRating";

const OverallRating = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Stack
      direction="row"
      spacing={2}
      width="100%"
      height="50vh"
      alignItems="flex-start"
      marginTop={3}
    >
      <Stack width="300px" height="50%">
        <Typography
          id="overall-rating"
          variant="h2"
          component="h2"
          sx={{ fontSize: "20px", fontWeight: "bold" }}
          marginBottom={2}
        >
          Overall Rating
        </Typography>
        <Stack spacing={2} aria-label="Linear Ratings">
          <LinearRating value={5} />
          <LinearRating value={4} />
          <LinearRating value={3} />
          <LinearRating value={2} />
          <LinearRating value={1} />
        </Stack>
      </Stack>
      <Stack spacing={2} alignItems="flex-start" width="50%" height="30%">
        <Stack
          alignItems="center"
          spacing={1}
          width="170px"
          height="100%"
          aria-label="Number Star Rating"
        >
          <Typography
            component="legend"
            variant="h3"
            sx={{ marginBottom: "8px" }}
          >
            {4.5}
          </Typography>
          <Rating
            name="decimal-rating"
            defaultValue={4.5}
            precision={0.1}
            readOnly
          />
        </Stack>
        <Button
          disableRipple
          onClick={handleOpen}
          sx={{
            fontSize: "10px",
            padding: "0px 0px 12px 44px",
            color: "#1E90FF",
            "&:hover": {
              backgroundColor: "inherit",
              boxShadow: "none",
            },
          }}
          aria-label="Leave A Review"
        >
          Leave a Review
        </Button>
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
              top: "100%",
              left: "150%",
              width: "10vw",
              height: "50vh",
              bgcolor: "white",
              p: 4,
            }}
          >
            <Stack spacing={2} alignItems="center">
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Quietness
              </Typography>
              <Rating name="quietness" defaultValue={4.5} precision={0.5} />
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Location
              </Typography>
              <Rating name="location" defaultValue={4.5} precision={0.5} />
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Cleanliness
              </Typography>
              <Rating name="cleanliness" defaultValue={4.5} precision={0.5} />
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Overall
              </Typography>
              <Rating name="overall" defaultValue={4.5} precision={0.5} />
              <Button
                disableRipple
                sx={{
                  fontSize: "10px",
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
      </Stack>
    </Stack>
  );
};

export default OverallRating;
