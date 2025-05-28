import React from "react";
import { Tooltip, Box, Typography } from "@mui/material";
import {
  LocationOn,
  Chair,
  Mic,
  Accessibility,
  SpatialAudio,
  Devices,
  Edit,
  Build,
} from "@mui/icons-material";
import { RoomUtilitiesResponse } from "@common/types";
import useRoomUtilities from "hooks/useRoomUtilities";

type RoomFeatureKey = keyof Pick<
  RoomUtilitiesResponse,
  | "floor"
  | "seating"
  | "microphone"
  | "accessibility"
  | "audiovisual"
  | "infotechnology"
  | "writingMedia"
  | "service"
>;

const iconMap: Record<RoomFeatureKey, JSX.Element> = {
  floor: <LocationOn />,
  seating: <Chair />,
  microphone: <Mic />,
  accessibility: <Accessibility />,
  audiovisual: <SpatialAudio />,
  infotechnology: <Devices />,
  writingMedia: <Edit />,
  service: <Build />,
};

const RoomUtilityTags = ({ roomId }: { roomId: string }) => {
  const { utilities } = useRoomUtilities(roomId);
  if (!utilities) return null;

  const featureKeys = (Object.keys(iconMap) as RoomFeatureKey[]).filter(
    (key) => {
      const value = utilities[key];
      if (!value) return false;
      return Array.isArray(value) ? value.length > 0 : value !== "";
    }
  );

  if (featureKeys.length === 0) return null;

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
      {featureKeys.map((key) => (
        <Tooltip
          key={key}
          title={
            Array.isArray(utilities[key])
              ? (utilities[key] as string[]).join(", ")
              : utilities[key]
          }
          arrow
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textTransform: "capitalize",
            }}
          >
            {React.cloneElement(iconMap[key], {
              sx: {
                fontSize: 24,
                color: "primary.main",
              },
            })}
            <Typography variant="caption">{key}</Typography>
          </Box>
        </Tooltip>
      ))}
    </Box>
  );
};

export default RoomUtilityTags;
