import { ArrowBack } from "@mui/icons-material";
import { Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { usePathname, useRouter } from "next/navigation";

import {
  selectCurrentBuilding,
  setCurrentBuilding,
} from "../redux/currentBuildingSlice";
import { useDispatch } from "../redux/hooks";
import { useSelector } from "../redux/hooks";
import BuildingDrawer from "../views/BuildingDrawer";

const RoomBackButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentBuilding = useSelector(selectCurrentBuilding);
  const path = usePathname();

  const handleBackButton = () => {
    router.back();
    dispatch(setCurrentBuilding(currentBuilding));
  };

  const drawerOpen = !!currentBuilding && (path == "/browse" || path == "/map");
  return (
    <>
      <Button
        onClick={handleBackButton}
        style={{
          backgroundColor: "transparent",
          position: "relative",
          right: "12px",
          width: "max-content",
        }}
        aria-label="back"
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
      <BuildingDrawer open={drawerOpen} />
    </>
  );
};

export default RoomBackButton;
