import { RoomStatus } from "@common/types";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Typography, TypographyProps } from "@mui/material";
import Box, { BoxProps } from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import RoomAvailability from "components/RoomAvailability";
import Link from "next/link";
import React from "react";

import useRoom from "../hooks/useRoom";

const IndiviRoomBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: 10,
  height: 90,
  fontSize: 20,
  fontWeight: 500,
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
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
  const ratingValue = 3.5;

  return (
    <Link href={`/room/${buildingId}-${roomNumber}`}>
      <IndiviRoomBox>
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
          justifyContent="space-around"
          alignItems="center"
        >
          <RoomAvailability roomStatus={roomStatus} />
          <ChevronRightIcon style={{ color: "grey" }} />
        </Stack>
      </IndiviRoomBox>
    </Link>
  );
};

export default RoomAvailabilityBox;
