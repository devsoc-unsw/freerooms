import RoomAvailability from "@frontend/components/rooms/RoomAvailability";
import RoomUtilityTags from "@frontend/components/rooms/RoomUtilityTags";
import useNearbyBookings from "@frontend/hooks/bookings/useNearbyBookings";
import useBuilding from "@frontend/hooks/buildings/useBuilding";
import useRoomRatings from "@frontend/hooks/ratings/useRoomRatings";
import useFavourites from "@frontend/hooks/rooms/useFavourites";
import useRoomStatus from "@frontend/hooks/rooms/useRoomStatus";
import room_photos from "@frontend/public/room-photos.json";
import { getCardStatus, getStatusEnd } from "@frontend/utils/availability";
import getRoomHref from "@frontend/utils/getRoomHref";
import { getCampus, getFloorLabel } from "@frontend/utils/roomLocation";
import { getBuildingIdFromRoomId } from "@frontend/utils/utils";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import FavouriteIcon from "@mui/icons-material/Favorite";
import FavouriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Collapse,
  Divider,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import translateRoomUsage from "common/roomUsages";
import type { Room } from "common/types";
import Image from "next/image";
import { useState } from "react";

type LoadingProps = {
  loading: true;
  room?: never;
  date?: never;
};

type LoadedProps = {
  loading?: false;
  room: Room;
  date?: string;
};

type RoomCardProps = LoadingProps | LoadedProps;

const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  height: theme.sizes.roomCard.height,
  overflow: "hidden",
  borderRadius: theme.radius.card,
}));

const Thumbnail = styled(Box)(({ theme }) => ({
  position: "relative",
  height: theme.sizes.roomCard.thumbnailHeight,
  margin: `0 ${theme.space.md}px`,
  overflow: "hidden",
  flexShrink: 0,
}));

const TitleRow = styled(Stack)(() => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  minWidth: 0,
}));

const LocationRow = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: theme.space.xs,
  marginBottom: theme.space.xs,
  minWidth: 0,
}));

const WidgetRow = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: theme.space.xs,
}));

const Widget = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: theme.space.xs,
  padding: `${theme.space.xs}px ${theme.space.sm}px`,
  borderRadius: theme.radius.pill,
  backgroundColor: theme.colours.accent.quaternary,
  fontSize: theme.typography.body2.fontSize,
  "& svg": { fontSize: "1.1em" },
}));

const UtilitiesToggle = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
  padding: `${theme.space.sm}px ${theme.space.md}px`,
}));

const campusLabel = { lower: "Lower campus", upper: "Upper campus" } as const;

// Round to the nearest half star only when the rating is close to .5
// (the same rule the room page header uses)
const roundRating = (rating: number): number => {
  const fraction = rating % 1;
  const isNearHalf = fraction >= 0.3 && fraction <= 0.7;
  return isNearHalf ? Math.floor(rating) + 0.5 : Math.round(rating);
};

const RoomCard: React.FC<RoomCardProps> = (props) => {
  const [utilitiesOpen, setUtilitiesOpen] = useState(false);

  const room = props.loading ? undefined : props.room;
  const buildingId = room ? getBuildingIdFromRoomId(room.id) : undefined;

  // The room's own photo if it has one, otherwise a photo of its building
  const buildingPhoto = `/assets/building_photos/${buildingId}.webp`;
  const roomPhotos = room
    ? room_photos[room.id as keyof typeof room_photos]
    : undefined;
  const [imageSrc, setImageSrc] = useState(roomPhotos?.[0] ?? buildingPhoto);

  const { isFavourite, toggleFavourite } = useFavourites();
  const { building } = useBuilding(buildingId);
  const { data: ratings } = useRoomRatings(room?.id);
  const { status } = useRoomStatus(room?.id);
  const needsBookings =
    status !== undefined &&
    (getCardStatus(status) === "busy" || !getStatusEnd(status));
  const { current, nextLaterThatDay } = useNearbyBookings(
    room?.id,
    needsBookings
  );
  if (props.loading || !room) {
    return (
      <Skeleton
        animation="wave"
        variant="rounded"
        width="100%"
        sx={(theme) => ({ height: theme.sizes.roomCard.height, flexShrink: 0 })}
      />
    );
  }

  const { date } = props;
  const favourite = isFavourite(room.id);
  const rating = roundRating(ratings?.overallRating ?? 0);
  const location = [
    buildingId ? campusLabel[getCampus(buildingId)] : null,
    building?.name,
    getFloorLabel(room.id),
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <StyledCard variant="outlined">
      <CardActionArea
        href={getRoomHref(room.id, date)}
        target="_blank"
        sx={(theme) => ({
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          flex: 1,
          minHeight: 0,
          paddingTop: `${theme.space.lg}px`,
          // no grey overlay on hover
          "&:hover .MuiCardActionArea-focusHighlight": { opacity: 0 },
        })}
      >
        <Thumbnail>
          <Image
            src={imageSrc}
            alt={`Image of ${room.name}`}
            fill
            sizes="(max-width: 600px) 100vw, 300px" // without this every card asks for a 1920px image
            style={{ objectFit: "cover", objectPosition: "center" }}
            onError={() => setImageSrc(buildingPhoto)}
          />
        </Thumbnail>

        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <TitleRow>
            <Typography variant="roomCardTitle" noWrap sx={{ minWidth: 0 }}>
              {room.name}
            </Typography>
            <IconButton
              size="small"
              sx={{ flexShrink: 0 }}
              aria-label={
                favourite ? "Remove as favourite" : "Add as favourite"
              }
              onClick={(event) => {
                // the button sits inside the link, so don't follow the link
                event.preventDefault();
                event.stopPropagation();
                toggleFavourite(room.id);
              }}
            >
              {favourite ? (
                <FavouriteIcon color="primary" fontSize="small" />
              ) : (
                <FavouriteBorderIcon fontSize="small" />
              )}
            </IconButton>
          </TitleRow>

          <LocationRow>
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
          </LocationRow>

          {status && (
            <RoomAvailability
              roomStatus={status}
              variant="pill"
              reason={current?.name}
              until={nextLaterThatDay?.start}
            />
          )}

          <Divider sx={{ marginBlock: (theme) => `${theme.space.sm}px` }} />

          <WidgetRow>
            <Widget>
              <StarBorderIcon
                sx={(theme) => ({ color: theme.colours.rating.display })}
              />
              <Typography variant="metadata">
                {rating === 0 ? "—" : rating}
              </Typography>
            </Widget>
            <Widget>
              <GroupOutlinedIcon />
              <Typography variant="metadata">{room.capacity}</Typography>
            </Widget>
            <Widget>
              <MeetingRoomOutlinedIcon />
              <Typography variant="metadata">
                {translateRoomUsage(room.usage)}
              </Typography>
            </Widget>
            <Widget>
              <BadgeOutlinedIcon />
              <Typography variant="metadata">
                {room.school !== " " ? "ID Required" : "ID Not Required"}
              </Typography>
            </Widget>
          </WidgetRow>
        </CardContent>
      </CardActionArea>

      <UtilitiesToggle onClick={() => setUtilitiesOpen((open) => !open)}>
        <Stack direction="row" sx={{ alignItems: "center" }}>
          <KeyboardArrowRightOutlinedIcon
            sx={(theme) => ({
              fontSize: theme.sizes.icon.sm,
              color: theme.colours.text.secondary,
            })}
          />
          <Typography variant="metadata" color="text.secondary">
            View all utilities
          </Typography>
        </Stack>
        <ArrowForwardOutlinedIcon
          sx={(theme) => ({ fontSize: theme.sizes.icon.md })}
        />
      </UtilitiesToggle>
      <Collapse in={utilitiesOpen}>
        <Box
          sx={(theme) => ({
            padding: `0 ${theme.space.md}px ${theme.space.md}px`,
          })}
        >
          {utilitiesOpen && <RoomUtilityTags roomId={room.id} />}
        </Box>
      </Collapse>
    </StyledCard>
  );
};

export default RoomCard;
