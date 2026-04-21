import { useTheme } from "@mui/material";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import React from "react";
import { getBuildingIdFromRoomId } from "../utils/utils";
import { Building } from "@common/types";
import { setCurrentBuilding } from "../redux/currentBuildingSlice";
import { useDispatch } from "../redux/hooks";
import { useRouter } from "next/navigation";
import Button from "./Button";
import useBuilding from "@frontend/hooks/useBuilding";

const ViewOnMapButton: React.FC<{
  roomId: string;
}> = ({ roomId }) => {
  const theme = useTheme();
  const buildingId = getBuildingIdFromRoomId(roomId);
  const dispatch = useDispatch();
  const router = useRouter();
  const { building } = useBuilding(buildingId);

  const handleMapRedirect = (buildingId: string) => {
    dispatch(setCurrentBuilding(building || null));
    router.push(`/map?building=${buildingId}`);
  };

  return (
    <Button
      aria-label="View on Map"
      name="View on Map"
      sx={{
        height: 45,
        ml: { xs: 0, sm: 1 },
        my: { xs: 1, sm: 0 },
        width: { xs: "100%", sm: "160px" },
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.main,
      }}
      variant="outlined"
      color="primary"
      onClick={() => handleMapRedirect(buildingId)}
    >
      <Typography variant="body2" fontWeight="bold">
        View on Map
      </Typography>
    </Button>
  );
};

export default ViewOnMapButton;
