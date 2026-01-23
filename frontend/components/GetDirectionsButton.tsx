"use client";
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
        backgroundColor: "#100100100",
        height: 34,
        width: 320,
        "&:hover": {
          backgroundColor: "#EF6C00",
        },
      }}
    >
      <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>
        Get Directions
      </Typography>
    </Button>
  );
};

export default GetDirectionsButton;
