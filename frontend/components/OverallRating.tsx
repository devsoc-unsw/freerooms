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
      sx={{ flexGrow: 1 }}
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
        <Stack spacing={2} aria-label="Linear Ratings" width="100%">
          <LinearRating value={5} />
          <LinearRating value={4} />
          <LinearRating value={3} />
          <LinearRating value={2} />
          <LinearRating value={1} />
        </Stack>
      </Stack>
      <Stack
        spacing={2}
        alignItems={{ xs: "center", sm: "flex-start" }}
        width="40%"
        height="40%"
      >
        <Stack
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
          width="40%"
          height="150%"
          aria-label="Number Star Rating"
        >
          <Typography
            component="legend"
            variant="h3"
            sx={{
              marginBottom: "16px",
              fontSize: "5rem",
              width: "100%",
              textAlign: "center",
            }}
          >
            {4.5}
          </Typography>
          <Rating
            name="decimal-rating"
            defaultValue={4.5}
            precision={0.1}
            readOnly
            size="large"
          />
          <Button
            onClick={handleOpen}
            sx={{
              textAlign: "center",
              fontSize: "10px",
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
                top: "160%",
                left: "165%",
                transform: "translate(-50%, -50%)",
                width: "20vw",
                minWidth: "300px",
                height: "50vh",
                bgcolor: "white",
                p: 4,
                borderRadius: "16px",
              }}
            >
              <Stack spacing={2} alignItems="center">
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Quietness
                </Typography>
                <Rating
                  name="quietness"
                  defaultValue={4.5}
                  precision={0.5}
                  size="large"
                />
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Location
                </Typography>
                <Rating
                  name="location"
                  defaultValue={4.5}
                  precision={0.5}
                  size="large"
                />
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Cleanliness
                </Typography>
                <Rating
                  name="cleanliness"
                  defaultValue={4.5}
                  precision={0.5}
                  size="large"
                />
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Overall
                </Typography>
                <Rating
                  name="overall"
                  defaultValue={4.5}
                  precision={0.5}
                  size="large"
                />
                <Button
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
    </Stack>
  );
};

export default OverallRating;
