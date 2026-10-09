import { Room } from "@common/types";
import RoomAvailability from "@frontend/components/rooms/RoomAvailability";
import RoomUtilityTags from "@frontend/components/rooms/RoomUtilityTags";
import useBuilding from "@frontend/hooks/useBuilding";
import useFavourites from "@frontend/hooks/useFavourites";
import useRoomRatings from "@frontend/hooks/useRoomRatings";
import useRoomStatus from "@frontend/hooks/useRoomStatus";
import room_photos from "@frontend/public/room-photos.json";
import getRoomHref from "@frontend/utils/getRoomHref";
import { getBuildingIdFromRoomId } from "@frontend/utils/utils";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import FavouriteIcon from "@mui/icons-material/Favorite";
import FavouriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PlaceIcon from "@mui/icons-material/Place";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import KeyboardArrowRightOutlinedIcon from '@mui/icons-material/KeyboardArrowRightOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import translateRoomUsage from "@common/roomUsages";
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
  useTheme,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
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

export const ROOM_CARD_HEIGHT = 300;

const StyledCard = styled(Card)(({ theme }) => ({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  height: ROOM_CARD_HEIGHT,
  overflow: "hidden",
  [theme.breakpoints.down("lg")]: { height: 300 },
}));

const ThumbnailBox = styled(Box)(({ theme }) => ({
  position: "relative",
  margin: theme.spacing(0, 1.5, 0, 1.5),
  height: 120,
  // borderRadius: theme.spacing(1),
  overflow: "hidden",
  flexShrink: 0,
  // padding: 100,
  // alignItems: "centre",
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
  gap: 4,
  marginBottom: theme.spacing(0.5),
  minWidth: 0,
}));

const AvailabilityRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== "statusKey", 
})<{ statusKey: "available" | "unavailable" | "soon" }>(({ theme, statusKey }) => {
  const colour = theme.colours.status[statusKey].text;
  // const main = available ? theme.palette.success.main : theme.palette.error.main;
  // const dark = available ? theme.palette.success.dark : theme.palette.error.dark;
  return {
    alignSelf: "flex-start",
    display: "inline-flex",
    alignItems: "center",
    gap: theme.spacing(0.5),
    maxWidth: "100%",
    width: "fit-content",
    borderRadius: 100,
    padding: theme.spacing(0, 1),
    backgroundColor: alpha(colour, 0.20),
    border: `1.5px solid ${colour}`,
    "& .MuiSvgIcon-root": {
      fontSize: 11,
      color: colour,
      flexShrink: 0,
    },
  };
});

const FavouriteButton = styled(IconButton)(({ theme }) => ({
  
}));

const WidgetRow = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  // justifyContent: "space-between",
  justifyContent: "flex-start",
  // padding: theme.spacing(1, 0),
  gap: theme.spacing(0.5),
}));

const Widget = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: 3,
  borderRadius: 100,
  padding: theme.spacing(0.25, 0.75),
  backgroundColor: theme.colours.accent.quaternary,
}));

const UtilitiesToggle = styled(Stack)(({ theme }) => ({
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "pointer",
  padding: theme.spacing(1.25, 1.5),
  // borderTop: `1px solid ${theme.colours.border.default}`,
}));

const getCampus = (buildingId?: string): "Lower" | "Upper" | null =>
  buildingId ? (+buildingId.substring(3) < 19 ? "Lower" : "Upper") : null;

const FLOOR_LABELS: Record<string, string> = {
  B: "Basement Floor",
  LG: "Lower Ground Floor",
  G: "Ground Floor",
  M: "Mezzanine Floor",
}; // Todo: add additional floors like Level 1 etc.

const getFloorLabel = (roomId: string): string | null => {
  const roomNumber = roomId.split("-")[2];
  const prefix = roomNumber?.match(/^([A-Za-z]+)/)?.[1]?.toUpperCase();
  return prefix ? (FLOOR_LABELS[prefix] ?? null) : null;
};

type RoomStatusValue = "free" | "busy" | "soon";
const STATUS_COLOUR_KEY: Record<RoomStatusValue, "available" | "unavailable" | "soon"> = {
  free: "available",
  busy: "unavailable",
  soon: "soon",
};

const STATUS_LABEL: Record<RoomStatusValue, string> = {
  free: "Available",
  busy: "Unavailable",
  soon: "Available Soon",
}

const getAvailabilityText = (roomStatus: { status: RoomStatusValue; endtime: string }): string => {
  const hoursMinutes = new Date(roomStatus.endtime).toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  if (hoursMinutes === "Invalid Date") return STATUS_LABEL[roomStatus.status];
  const preposition = roomStatus.status === "soon" ? "at" : "until";
  return `${STATUS_LABEL[roomStatus.status]} ${preposition} ${hoursMinutes}`;
};

const RoomCard: React.FC<RoomCardProps> = (props) => {
  const theme = useTheme();

  const [utilitiesOpen, setUtilitiesOpen] = useState(false);
  const room = props.loading ? undefined : props.room;
  const buildingId = room ? getBuildingIdFromRoomId(room.id) : undefined;
  const roomPhotoUrls = room ? room_photos[room.id as keyof typeof room_photos] : undefined;
  const thumbnailSrc =
    roomPhotoUrls && roomPhotoUrls.length > 0
      ? roomPhotoUrls[0]
      : `/assets/building_photos/${buildingId}.webp`;
  const [imgSrc, setImgSrc] = useState(thumbnailSrc); // allows for fallback
  const { isFavourite, toggleFavourite } = useFavourites();
  const { building } = useBuilding(buildingId);
  const { data: ratingsData } = useRoomRatings(room?.id);
  const { status } = useRoomStatus(room?.id ?? "");

  if (props.loading || !room) {
    return (
      <Skeleton
        animation="wave"
        variant="rounded"
        width="100%"
        height={ROOM_CARD_HEIGHT}
        sx={{ marginTop: 1, flexShrink: 0 }}
      />
    );
  }

  // const { room, date } = props;

  // const { name, roomNumber, date, status, endtime } = props;
  // const roomStatus = { status, endtime };
  const { date } = props;
  const roomHref = getRoomHref(room.id, date);
  const favourite = isFavourite(room.id);

  const ratingValue = (() => {
    if (!ratingsData || !ratingsData.overallRating) return 0;
    const rating = ratingsData.overallRating;
    const frac = rating % 1;
    return frac >= 0.3 && frac <= 0.7 ? Math.floor(rating) + 0.5 : Math.round(rating);
  })(); // again unsure if this is the correct way to do this stuff. 

  const isAvailable = status?.status === "free";

  return (
    <StyledCard variant="outlined">
      <CardActionArea
        href={roomHref}
        target="_blank"
        sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", flex: 1, minHeight: 0, pt: 2.5 }}
      >
        <ThumbnailBox>
          <Image
            src={imgSrc}
            alt={`Image of ${room.name}`}
            fill
            sizes="(max-width: 600px) 100vw, 300px" // was defaulting to 100vw → 1920w for every card
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </ThumbnailBox>

        <CardContent sx={{ flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
          <TitleRow>
            <Typography sx={{ fontWeight: 900, fontSize: 18, minWidth: 0, flexShrink: 1 }} noWrap>{room.name}</Typography>
            <FavouriteButton
              sx={{ flexShrink: 0 }}
              aria-label={favourite ? "Remove as favourite" : "Add as favourite"}
              size="small"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                toggleFavourite(room.id);
              }}
            >
              {favourite ? <FavouriteIcon color="primary" fontSize="small" /> : <FavouriteBorderIcon fontSize="small" />}
            </FavouriteButton>
          </TitleRow>
          <LocationRow>
            <PlaceOutlinedIcon sx={{ fontSize: 14, color: theme.colours.text.secondary }} />
            <Typography sx={{ fontSize: 11, color: theme.colours.text.secondary, minWidth: 0 }} noWrap>
              {[
                getCampus(buildingId) ? `${getCampus(buildingId)} campus` : null,
                building?.name,
                getFloorLabel(room.id),
              ]
                .filter(Boolean)
                .join(", ")}
            </Typography>
          </LocationRow>

          {status && (
            <AvailabilityRow statusKey={STATUS_COLOUR_KEY[status.status]}>
              <AccessTimeOutlinedIcon />
              {/* <RoomAvailability roomStatus={status} /> */}
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  color: theme.colours.status[STATUS_COLOUR_KEY[status.status]].text,
                }}
              >
                {getAvailabilityText(status)}
              </Typography>
            </AvailabilityRow>
          )}

          <Divider sx={{ marginY: 1 }} />

          <WidgetRow>
            <Widget>
              <StarBorderIcon sx={{ fontSize: 13, color: theme.colours.rating.display }} />
              <Typography sx={{ fontSize: 11 }}>{ratingValue === 0 ? "—" : ratingValue}</Typography>
            </Widget>
            <Widget>
              <GroupOutlinedIcon sx={{ fontSize: 13 }} />
              <Typography sx={{ fontSize: 11 }}>{room.capacity}</Typography>
            </Widget>
            <Widget>
              <MeetingRoomOutlinedIcon sx={{ fontSize: 13 }} />
              <Typography sx={{ fontSize: 11 }}>{translateRoomUsage(room.usage)}</Typography>
            </Widget>
            <Widget>
              <BadgeOutlinedIcon sx={{ fontSize: 13 }} />
              <Typography sx={{ fontSize: 11 }}>{room.school !== " " ? "ID Required" : "ID Not Required"}</Typography>
            </Widget>
          </WidgetRow>
        </CardContent>
      </CardActionArea>

      <UtilitiesToggle onClick={() => setUtilitiesOpen((open) => !open)}>
        <Stack direction="row" sx={{ alignItems: "center" }} spacing={0.5}>
          <KeyboardArrowRightOutlinedIcon sx={{ fontSize: 14, color: theme.colours.text.secondary }} />
          <Typography sx={{ fontSize: 13, color: theme.colours.text.secondary }}>View all utilities</Typography>
        </Stack>
        <ArrowForwardOutlinedIcon sx={{ fontSize: 20 }} />
      </UtilitiesToggle>
      <Collapse in={utilitiesOpen}>
        <Box sx={{ padding: theme.spacing(0, 1.5, 1.5) }}>
          {utilitiesOpen && <RoomUtilityTags roomId={room.id} />}
        </Box>
      </Collapse>
    </StyledCard>
  );
};

export default RoomCard;
