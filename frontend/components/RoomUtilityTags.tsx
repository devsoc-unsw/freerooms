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
import { Box, Stack, Typography, useTheme } from "@mui/material";
import useRoomUtilities from "hooks/useRoomUtilities";
import type React from "react";

import UtilityAccordion from "./UtilityAccordian";

const ICON_SIZE = 18;

export default function RoomUtilities({ roomId }: { roomId: string }) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  const categoryInfo: Record<
    string,
    { title: string; icon: React.ReactElement }
  > = {
    floor: {
      title: "Floor Type",
      icon: <ViewQuilt sx={{ fontSize: ICON_SIZE, color: primary }} />,
    },
    seating: {
      title: "Seating",
      icon: <Chair sx={{ fontSize: ICON_SIZE, color: primary }} />,
    },
    microphone: {
      title: "Audio Equipment",
      icon: <Mic sx={{ fontSize: ICON_SIZE, color: primary }} />,
    },
    accessibility: {
      title: "Accessibility Features",
      icon: <Accessible sx={{ fontSize: ICON_SIZE, color: primary }} />,
    },
    audiovisual: {
      title: "Visual & Display",
      icon: <Monitor sx={{ fontSize: ICON_SIZE, color: primary }} />,
    },
    infotechnology: {
      title: "Technology & Connectivity",
      icon: <Devices sx={{ fontSize: ICON_SIZE, color: primary }} />,
    },
    writingMedia: {
      title: "Writing Surfaces",
      icon: <Edit sx={{ fontSize: ICON_SIZE, color: primary }} />,
    },
    service: {
      title: "Additional Services",
      icon: <Settings sx={{ fontSize: ICON_SIZE, color: primary }} />,
    },
  };

  const { utilities: roomData } = useRoomUtilities(roomId);
  if (!roomData) return null;

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
          <AcUnit sx={{ fontSize: ICON_SIZE, color: primary }} />
        ),
        items,
      };
    });

  return (
    <Box height="100%" width="100%" pt={6} pb={3}>
      <Typography
        sx={{ mb: 3 }}
        variant="h5"
        component="h2"
        fontWeight="bold"
        gutterBottom
      >
        Room Utilities
      </Typography>

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
