import { RoomStatus } from "@common/types";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Typography, TypographyProps } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import RoomAvailability from "components/RoomAvailability";
import useRoomRatings from "hooks/useRoomRatings";
import Link from "next/link";
import React from "react";
import roomPhotos from "../public/room-photos.json"

import useRoom from "../hooks/useRoom";

interface IndiviRoomBoxProps extends BoxProps {
  bgImage: string;
}

const IndiviRoomBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "bgImage"
})<IndiviRoomBoxProps>(({ theme, bgImage }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: 10,
  height: 90,
  fontSize: 20,
  fontWeight: 500,
  backgroundColor: "transparent",
  backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), ${bgImage}`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundBlendMode: "darken",
  color: theme.palette.mode === "light" ? "#FFFFFF" : "000000",
  padding: theme.spacing(2, 2, 2, 3),
  margin: theme.spacing(1.5, 1),
  "&:hover": {
    border: "1px solid",
    borderColor: theme.palette.primary.main,
    cursor: "pointer",
  },
}));

const RoomBoxHeading = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,
  whiteSpace: "nowrap",
}));

const RoomBoxSubheading = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: 12,
  fontWeight: 400,
}));

export interface RoomAvailabilityBoxProps {
  roomNumber: string;
  roomStatus: RoomStatus;
  buildingId: string;
}

const RoomAvailabilityBox: React.FC<RoomAvailabilityBoxProps> = ({
  roomNumber,
  roomStatus,
  buildingId,
}) => {
  const { room } = useRoom(`${buildingId}-${roomNumber}`);
  const { data } = useRoomRatings(room ? room.id : "");
  const ratingValue = (() => {
    // round rating to nearest .5 if a rating exists
    if (!data) return 0;
    const rating = data.overallRating;
    const frac = rating % 1;
    return frac >= 0.3 && frac <= 0.7
      ? Math.floor(rating) + 0.5
      : Math.round(rating);
  })();
  
  const key = `${buildingId}-${roomNumber}` as keyof typeof roomPhotos 
  const photos = roomPhotos[key]
  const photoURL = photos?.length > 0 ? photos[0] : `/assets/building_photos/${buildingId}.webp` 

  return (
    <Link href={`/room/${buildingId}-${roomNumber}`}>
      <IndiviRoomBox bgImage={`url(${photoURL})`}>
        <Stack direction="column">
          <RoomBoxHeading> {roomNumber} </RoomBoxHeading>
          <Stack direction="row" spacing={0.3} aria-label="5-star-info">
            <Typography sx={{ fontSize: 12, fontWeight: 400 }}>
              {ratingValue}
            </Typography>
            <Rating
              readOnly
              value={ratingValue}
              size="small"
              precision={0.5}
              sx={{ color: "rgb(255, 169, 12)" }}
            />
          </Stack>
          <RoomBoxSubheading>{!room ? "" : room.name}</RoomBoxSubheading>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <RoomAvailability roomStatus={roomStatus}/>
          <ChevronRightIcon style={{ color: "grey" }} />
        </Stack>
      </IndiviRoomBox>
    </Link>
  );
};

export default RoomAvailabilityBox;
