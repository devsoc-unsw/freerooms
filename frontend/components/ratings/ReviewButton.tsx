import { Button } from "@mui/material";
import ReviewModal from "components/Rating/ReviewModal";
import { useState } from "react";

interface ReviewButtonProps {
  buildingID: string;
  roomID: string;
}

export default function ReviewButton({
  buildingID,
  roomID,
}: ReviewButtonProps) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        aria-label="leave-review-link"
        onClick={handleOpen}
        variant="outlined"
      >
        Leave a Rating
      </Button>
      <ReviewModal
        open={open}
        roomID={roomID}
        buildingID={buildingID}
        handleClose={handleClose}
      />
    </>
  );
}
