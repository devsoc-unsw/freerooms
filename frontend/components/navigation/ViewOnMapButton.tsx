import Button from "@frontend/components/ui/Button";
import useBuilding from "@frontend/hooks/buildings/useBuilding";
import { useDispatch } from "@frontend/redux/hooks";
import { setCurrentBuilding } from "@frontend/redux/slices/currentBuildingSlice";
import DirectionsWalkOutlinedIcon from "@mui/icons-material/DirectionsWalkOutlined";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import React from "react";

const ViewOnMapButton: React.FC<{
  buildingId: string;
  variant?: "default" | "full-width";
}> = ({ buildingId, variant = "default" }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { building } = useBuilding(buildingId);

  const handleMapRedirect = (buildingId: string) => {
    dispatch(setCurrentBuilding(building || null));
    router.push(`/map?building=${buildingId}`);
  };

  return (
    <Button
      aria-label="Get Directions"
      name="Get Directions"
      sx={(theme) => ({
        height: 45,
        gap: `${theme.space.sm}px`,
        ml:
          variant === "full-width"
            ? "0px"
            : { xs: 0, sm: `${theme.space.sm}px` },
        my: { xs: `${theme.space.sm}px`, sm: 0 },
        width: variant === "full-width" ? "100%" : { xs: "100%", sm: "160px" },
        position: "relative",
        //right: variant === "full-width" ? "6px" : "0px", //this is because building drawer has weird margin idk
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        "&:hover": {
          opacity: 0.9,
        },
      })}
      variant="outlined"
      color="primary"
      onClick={() => handleMapRedirect(buildingId)}
    >
      <DirectionsWalkOutlinedIcon fontSize="small" />
      <Typography variant="body2">
        <>Get Directions</>
      </Typography>
    </Button>
  );
};

export default ViewOnMapButton;
