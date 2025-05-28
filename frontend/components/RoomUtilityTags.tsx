"use client";

import type React from "react";

import {
  Box,
  Typography,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  ViewQuilt,
  Mic,
  Monitor,
  Accessible,
  Edit,
  Settings,
  Chair,
  Devices,
  AcUnit,
  ExpandMore,
} from "@mui/icons-material";
import useRoomUtilities from "hooks/useRoomUtilities";

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
        {categories.map((category) => (
          <Accordion
            key={category.key}
            disableGutters
            elevation={0}
            sx={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px !important",
              overflow: "hidden",
              "&:before": {
                display: "none",
              },
              mb: 1,
              "&:hover": {
                borderColor: ORANGE,
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore sx={{ color: ORANGE }} />}
              sx={{
                backgroundColor: "#fafafa",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
                "&.Mui-expanded": {
                  backgroundColor: "#fef7f0",
                },
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                {category.icon}
                <Typography
                  variant="subtitle2"
                  fontWeight="medium"
                  color="text.primary"
                >
                  {category.title}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: ORANGE,
                    backgroundColor: "#fef7f0",
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    fontWeight: "medium",
                  }}
                >
                  {category.items ? category.items.length : 0}
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 2, backgroundColor: "#fefefe" }}>
              <Stack
                direction="row"
                spacing={0.5}
                sx={{ flexWrap: "wrap", gap: 0.75 }}
              >
                {category.items &&
                  category.items.map((item, itemIndex) => (
                    <Chip
                      key={itemIndex}
                      label={item}
                      size="small"
                      sx={{
                        fontSize: "0.75rem",
                        height: 26,
                        backgroundColor: "#f9f9f9",
                        color: "#424242",
                        border: "1px solid #e0e0e0",
                        "&:hover": {
                          backgroundColor: "#fef7f0",
                          borderColor: ORANGE,
                          transform: "translateY(-1px)",
                          boxShadow: "0 2px 4px rgba(245, 125, 4, 0.15)",
                        },
                        transition: "all 0.2s ease-in-out",
                        "& .MuiChip-label": {
                          px: 1.5,
                          fontWeight: "medium",
                        },
                      }}
                    />
                  ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
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
