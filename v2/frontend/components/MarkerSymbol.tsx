import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import React from "react";

const MarkerSymbol: React.FC<{ buildingLabel: string, freerooms: number }> = ({
                                                                        buildingLabel, freerooms
                                                                        }) => {


  return (
    <Tooltip title={`${freerooms} room${freerooms === 1 ? "" : "s"} available`}>
      <div style={{ display: 'inline-block' }}>
        <Typography sx={{ fontSize: 10, fontWeight: 200, textAlign: "center" }}>
          {buildingLabel}
        </Typography>

        <Box
          sx={(theme) => ({
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "4px solid white",
            backgroundColor:
              freerooms >= 5
                ? theme.palette.success.light
                : freerooms !==0
                  ? theme.palette.warning.light
                  : theme.palette.error.light,
          })}
        />
      </div>
    </Tooltip>
  );
};


export { MarkerSymbol };