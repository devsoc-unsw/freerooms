import { ArrowBack } from "@mui/icons-material";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

import {
  selectCurrentBuilding,
  setCurrentBuilding,
} from "../redux/currentBuildingSlice";
import { useDispatch } from "../redux/hooks";
import { useSelector } from "../redux/hooks";

const RoomBackButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentBuilding = useSelector(selectCurrentBuilding);

  const handleBackButton = () => {
    router.back();
    dispatch(setCurrentBuilding(currentBuilding));
  };

  return (
    <>
      <Button
        aria-label="back"
        onClick={handleBackButton}
        style={{
          backgroundColor: "transparent",
          position: "relative",
          right: "12px",
          width: "max-content",
        }}
      >
        <ArrowBack />
        <Typography
          variant="body1"
          marginLeft={1}
          sx={{
            textDecoration: "underline",
          }}
        >
          Back
        </Typography>
      </Button>
    </>
  );
};

export default RoomBackButton;
