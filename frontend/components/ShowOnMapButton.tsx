"use client";
import { useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import React from "react";

import Button from "./Button";

const ShowOnMapButton: React.FC<{
  roomId: string;
}> = ({ roomId }) => {
  const theme = useTheme();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/map?roomId=${roomId}`);
  };

  return (
    <Button
      onClick={handleClick}
      aria-label="Show on Map"
      name="Show on Map"
      sx={{
        backgroundColor: theme.palette.secondary.main,
        color: theme.palette.text.primary,
        height: 45,
        ml: { xs: 0, sm: 1 },
        my: { xs: 1, sm: 0 },
        width: { xs: "100%", sm: "160px" },
      }}
    >
      <Typography variant="body2" fontWeight="bold">
        Show on Map
      </Typography>
    </Button>
  );
};

export default ShowOnMapButton;
