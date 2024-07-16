import { Box, Button, LinearProgress, Modal } from "@mui/material";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";

const OverallRating = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div style={{ display: "flex" }}>
      <div>
        <Typography id="overall-rating" sx={{ fontSize: "10px" }}>
          Overall Rating
        </Typography>
        <div>
          <LinearProgress variant="determinate" sx={{ marginTop: "1px" }} />
          <LinearProgress variant="determinate" sx={{ marginTop: "1px" }} />
          <LinearProgress variant="determinate" sx={{ marginTop: "1px" }} />
          <LinearProgress variant="determinate" sx={{ marginTop: "1px" }} />
          <LinearProgress variant="determinate" sx={{ marginTop: "1px" }} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <Typography component="legend" variant="h4" align="center">
            {4.5}
          </Typography>
          <Rating
            name="decimal-rating"
            defaultValue={4.5}
            precision={0.1}
            readOnly
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            onClick={handleOpen}
            sx={{ fontSize: "10px", padding: "4px 4px" }}
          >
            Leave a Review
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Text in a modal
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
            </Box>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default OverallRating;
