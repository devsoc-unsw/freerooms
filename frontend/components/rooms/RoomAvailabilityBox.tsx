import RoomAvailability from "@frontend/components/rooms/RoomAvailability";
import useBuilding from "@frontend/hooks/buildings/useBuilding";
import useFavourites from "@frontend/hooks/rooms/useFavourites";
import useRoom from "@frontend/hooks/rooms/useRoom";
import useRoomAvailabilityReason from "@frontend/hooks/rooms/useRoomAvailabilityReason";
import roomPhotos from "@frontend/public/room-photos.json";
import { DRAWER_ROOM_TILE_OVERLAY_OPACITY } from "@frontend/utils/constants";
import getRoomHref from "@frontend/utils/getRoomHref";
import { getRoomLocationLabel } from "@frontend/utils/roomLocation";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import FavouriteIcon from "@mui/icons-material/Favorite";
import FavouriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { IconButton, Stack, Typography } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import { RoomStatus } from "common/types";
import Link from "next/link";
import React from "react";

const RoomTile = styled(Link, {
  shouldForwardProp: (prop) => prop !== "bgImage",
})<{ bgImage: string }>(({ theme, bgImage }) => {
  const overlay = alpha(
    theme.colours.surface.paper,
    DRAWER_ROOM_TILE_OVERLAY_OPACITY
  );
  return {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: theme.space.sm,
    padding: theme.space.md,
    minHeight: theme.sizes.drawerRoomTile.minHeight,
    borderRadius: theme.radius.card,
    border: `1px solid ${theme.colours.border.default}`,
    backgroundImage: `linear-gradient(${overlay}, ${overlay}), ${bgImage}`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    color: theme.colours.text.primary,
    textDecoration: "none",
    "&:hover": { borderColor: theme.palette.primary.main },
  };
});

export interface RoomAvailabilityBoxProps {
  roomNumber: string;
  roomStatus: RoomStatus;
  buildingId: string;
  date?: string;
}

const RoomAvailabilityBox: React.FC<RoomAvailabilityBoxProps> = ({
  roomNumber,
  roomStatus,
  buildingId,
  date,
}) => {
  const roomId = `${buildingId}-${roomNumber}`;
  const { room } = useRoom(roomId);
  const { building } = useBuilding(buildingId);
  const { isFavourite, toggleFavourite } = useFavourites();

  const { reason, until } = useRoomAvailabilityReason(roomId, roomStatus);

  const photos = roomPhotos[roomId as keyof typeof roomPhotos];
  const photoURL =
    photos?.length > 0
      ? photos[0]
      : `/assets/building_photos/${buildingId}.webp`;

  const favourite = isFavourite(roomId);
  const location = getRoomLocationLabel(roomId, buildingId, building?.name);

  return (
    <RoomTile href={getRoomHref(roomId, date)} bgImage={`url(${photoURL})`}>
      <Stack
        sx={(theme) => ({
          minWidth: 0,
          justifyContent: "center",
          gap: `${theme.space.xs}px`,
        })}
      >
        <Typography variant="roomCardTitle" noWrap>
          {room?.name ?? roomNumber}
        </Typography>

        <Stack
          direction="row"
          sx={(theme) => ({
            alignItems: "center",
            gap: `${theme.space.xs}px`,
            minWidth: 0,
          })}
        >
          <PlaceOutlinedIcon
            sx={(theme) => ({
              fontSize: theme.sizes.icon.sm,
              color: theme.colours.text.secondary,
            })}
          />
          <Typography
            variant="metadata"
            color="text.secondary"
            noWrap
            sx={{ minWidth: 0 }}
          >
            {location}
          </Typography>
        </Stack>

        <RoomAvailability
          roomStatus={roomStatus}
          variant="pill"
          reason={reason}
          until={until}
        />
      </Stack>

      <Stack sx={{ justifyContent: "space-between", alignItems: "flex-end" }}>
        <IconButton
          size="small"
          aria-label={favourite ? "Remove as favourite" : "Add as favourite"}
          onClick={(event) => {
            // the button sits inside the link, so don't follow the link
            event.preventDefault();
            event.stopPropagation();
            toggleFavourite(roomId);
          }}
        >
          {favourite ? (
            <FavouriteIcon color="primary" fontSize="small" />
          ) : (
            <FavouriteBorderIcon fontSize="small" />
          )}
        </IconButton>
        <ArrowForwardOutlinedIcon
          sx={(theme) => ({ fontSize: theme.sizes.icon.md })}
        />
      </Stack>
    </RoomTile>
  );
};

export default RoomAvailabilityBox;
