"use client";

import {
  Accessible,
  AcUnit,
  Chair,
  Devices,
  Edit,
  Mic,
  Monitor,
  Settings,
  ViewQuilt,
} from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import useRoomUtilities from "hooks/useRoomUtilities";
import type React from "react";
import UtilityAccordion from "./UtilityAccordian";

// Constants
const ORANGE = "#f57d04";
const ICON_SIZE = 18;
const categoryInfo: Record<
  string,
  { title: string; icon: React.ReactElement }
> = {
  floor: {
    title: "Floor Type",
    icon: <ViewQuilt sx={{ fontSize: ICON_SIZE, color: ORANGE }} />,
  },
  seating: {
    title: "Seating",
    icon: <Chair sx={{ fontSize: ICON_SIZE, color: ORANGE }} />,
  },
  microphone: {
    title: "Audio Equipment",
    icon: <Mic sx={{ fontSize: ICON_SIZE, color: ORANGE }} />,
  },
  accessibility: {
    title: "Accessibility Features",
    icon: <Accessible sx={{ fontSize: ICON_SIZE, color: ORANGE }} />,
  },
  audiovisual: {
    title: "Visual & Display",
    icon: <Monitor sx={{ fontSize: ICON_SIZE, color: ORANGE }} />,
  },
  infotechnology: {
    title: "Technology & Connectivity",
    icon: <Devices sx={{ fontSize: ICON_SIZE, color: ORANGE }} />,
  },
  writingMedia: {
    title: "Writing Surfaces",
    icon: <Edit sx={{ fontSize: ICON_SIZE, color: ORANGE }} />,
  },
  service: {
    title: "Additional Services",
    icon: <Settings sx={{ fontSize: ICON_SIZE, color: ORANGE }} />,
  },
};

export default function RoomUtilities({ roomId }: { roomId: string }) {
  const { utilities: roomData } = useRoomUtilities(roomId);
  if (!roomData) return null;

  // Filter and map room data to categories
  const categories = Object.entries(roomData)
    .filter(([key, value]) => {
      if (key === "id" || key === "name") return false;
      if (typeof value === "string") return !!value;
      return Array.isArray(value) && value.length > 0;
    })
    .map(([key, value]) => {
      const items = typeof value === "string" ? [value] : value;
      return {
        key,
        title: categoryInfo[key]?.title || key,
        icon: categoryInfo[key]?.icon || (
          <AcUnit sx={{ fontSize: ICON_SIZE, color: ORANGE }} />
        ),
        items,
      };
    });

  return (
    <Box height="100%" width="100%" pt={6} pb={3}>
      {/* Title of the section */}
      <Typography
        sx={{ mb: 3 }}
        variant="h5"
        component="h2"
        fontWeight="bold"
        gutterBottom
      >
        Room Utilities
      </Typography>

      {/* Display each category as an accordion */}
      <Stack spacing={1}>
        {categories.map(({ key, title, icon, items }) => (
          <UtilityAccordion
            key={key}
            title={title}
            icon={icon}
            items={items || []}
          />
        ))}
      </Stack>

      {/* If no categories are available, show a message */}
      {categories.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body2" color="text.secondary">
            No utilities information available for this room.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
