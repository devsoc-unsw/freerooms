import useBuilding from "@frontend/hooks/useBuilding";
import { useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import React from "react";

import { setCurrentBuilding } from "../redux/currentBuildingSlice";
import { useDispatch } from "../redux/hooks";
import Button from "./Button";

const ViewOnMapButton: React.FC<{
  buildingId: string;
  variant?: "default" | "full-width";
}> = ({ buildingId, variant = "default" }) => {
  const theme = useTheme();

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
        ml: variant === "full-width" ? "0px" : { xs: 0, sm: 1 },
        my: { xs: 1, sm: 0 },
        width: variant === "full-width" ? "100%" : { xs: "100%", sm: "160px" },
        position: "relative",
        //right: variant === "full-width" ? "6px" : "0px", //this is because building drawer has weird margin idk
        backgroundColor: theme.palette.background.default,
        color: theme.palette.primary.main,
      }}
      variant="outlined"
      color="primary"
      onClick={() => handleMapRedirect(buildingId)}
    >
      <Typography variant="body2" sx={{ fontWeight: "bold" }}>
        View on Map
      </Typography>
    </Button>
  );
};

export default ViewOnMapButton;
