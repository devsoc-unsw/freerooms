"use client";

import { useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";

import Button from "./Button";

type GetDirectionsProps = {
  userLat: number | undefined;
  userLng: number | undefined;
  setRouteGeoJSON: (geojson: any) => void;
  geometry?: any;
};

const GetDirectionsButton: React.FC<GetDirectionsProps> = ({
  userLat,
  userLng,
  setRouteGeoJSON,
  geometry,
}) => {
  const theme = useTheme();

  const handleClick = () => {
    if (userLat != null && userLng != null) {
      if (!geometry) {
        console.warn("No route geometry available yet.");
        return;
      }
      // User location available -> show route
      setRouteGeoJSON({
        type: "Feature",
        properties: {},
        geometry,
      });
    } else {
      // Request user location
      alert("User location not available.");
    }
  };

  return (
    <Button
      aria-label="Get Directions"
      name="Get Directions"
      onClick={handleClick}
      sx={{
        backgroundColor: theme.palette.secondary.main + "FF",
        color: theme.palette.text.primary,
        height: 45,
        ml: { xs: 0, sm: 1 },
        my: { xs: 1, sm: 0 },
        width: { xs: "100%", sm: "160px" },
      }}
    >
      <Typography>Get Directions</Typography>
    </Button>
  );
};

export default GetDirectionsButton;
