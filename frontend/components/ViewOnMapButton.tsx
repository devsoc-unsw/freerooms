import { useTheme } from "@mui/material";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import React from "react";

import Button from "./Button";

const ViewOnMapButton: React.FC<{
  buildingId: string;
}> = ({ buildingId }) => {
  const theme = useTheme();

  return (
    <Link href={`/map`}>
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
      >
        <Typography variant="body2" fontWeight="bold">
          View on Map
        </Typography>
      </Button>
    </Link>
  );
};

export default ViewOnMapButton;
