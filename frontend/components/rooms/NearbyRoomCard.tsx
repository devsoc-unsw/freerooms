"use client";

import RoomAvailability from "@frontend/components/rooms/RoomAvailability";
import useFavourites from "@frontend/hooks/rooms/useFavourites";
import roomPhotos from "@frontend/public/room-photos.json";
import { space } from "@frontend/theme";
import getRoomHref from "@frontend/utils/getRoomHref";
import type { NearbyRoom } from "@frontend/utils/nearbyRooms";
import { getRoomLocationLabel } from "@frontend/utils/roomLocation";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import FavouriteIcon from "@mui/icons-material/Favorite";
import FavouriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import {
  Box,
  Card,
  CardActionArea,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const NearbyRoomCard = ({ room, building, status }: NearbyRoom) => {
  const { isFavourite, toggleFavourite } = useFavourites();

  const favourite = isFavourite(room.id);

  const buildingPhoto = `/assets/building_photos/${building.id}.webp`;

  const photos = roomPhotos[room.id as keyof typeof roomPhotos];

  const [imageSrc, setImageSrc] = useState<string | null>(
    photos?.[0] ?? buildingPhoto
  );

  const location = getRoomLocationLabel(room.id, building.id, building.name);

  return (
    <Card
      variant="outlined"
      sx={(theme) => ({
        position: "relative",
        isolation: "isolate",
        overflow: "hidden",
        height: theme.sizes.nearbyRoomCard.height,
        width: "100%",
        borderRadius: `${theme.radius.card}px`,
        backgroundColor: theme.palette.background.paper,
        boxShadow: "none",
      })}
    >
      {imageSrc && (
        <Box
          aria-hidden="true"
          sx={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        >
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes="300px"
            style={{ objectFit: "cover" }}
            onError={() => {
              setImageSrc((previous) =>
                previous === buildingPhoto ? null : buildingPhoto
              );
            }}
          />

          <Box
            sx={(theme) => ({
              position: "absolute",
              inset: 0,
              backgroundColor: alpha(
                theme.palette.background.paper,
                theme.palette.mode === "dark" ? 0.85 : 0.82
              ),
            })}
          />
        </Box>
      )}

      <CardActionArea
        component={Link}
        href={getRoomHref(room.id)}
        sx={(theme) => ({
          position: "relative",
          display: "grid",
          gridTemplateColumns: `minmax(0, 1fr) ${theme.sizes.control.sm}px`,
          alignItems: "start",
          gap: theme.space.xs,
          height: "100%",
          padding: `${theme.space.md}px`,
          "&.Mui-focusVisible": {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: -2,
          },
        })}
      >
        <Stack spacing={space.xs} sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle1"
            noWrap
            title={room.name}
            sx={(theme) => ({
              fontWeight: theme.typography.fontWeightBold,
            })}
          >
            {room.name}
          </Typography>

          <Stack
            direction="row"
            spacing={space.xs}
            sx={{ alignItems: "center", minWidth: 0 }}
          >
            <PlaceOutlinedIcon
              sx={(theme) => ({
                fontSize: theme.sizes.icon.sm,
                color: theme.palette.text.secondary,
                flexShrink: 0,
              })}
            />

            <Typography
              variant="metadata"
              color="text.secondary"
              title={location}
              noWrap
              sx={{ minWidth: 0, lineHeight: 1.25 }}
            >
              {location}
            </Typography>
          </Stack>

          <RoomAvailability roomStatus={status} variant="pill" />

          {room.school !== " " && (
            <Typography variant="metadata" color="text.secondary">
              ID Required
            </Typography>
          )}
        </Stack>

        <ArrowForwardOutlinedIcon
          sx={(theme) => ({
            alignSelf: "end",
            justifySelf: "center",
            fontSize: theme.sizes.icon.md,
            color: theme.palette.text.secondary,
          })}
        />
      </CardActionArea>

      <IconButton
        size="small"
        aria-label={favourite ? "Remove as favourite" : "Add as favourite"}
        aria-pressed={favourite}
        onClick={() => toggleFavourite(room.id)}
        sx={(theme) => ({
          position: "absolute",
          top: theme.space.sm,
          right: theme.space.md,
          width: theme.sizes.control.sm,
          height: theme.sizes.control.sm,
          color: theme.palette.primary.main,
          zIndex: 2,
        })}
      >
        {favourite ? (
          <FavouriteIcon fontSize="small" />
        ) : (
          <FavouriteBorderIcon fontSize="small" />
        )}
      </IconButton>
    </Card>
  );
};

export default NearbyRoomCard;
