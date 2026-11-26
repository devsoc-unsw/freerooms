"use client";

import { space } from "@frontend/theme";
import getRoomHref from "@frontend/utils/getRoomHref";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import { Button, Stack } from "@mui/material";
import Link from "next/link";

import ViewOnMapButton from "../navigation/ViewOnMapButton";

type BookingRoomActionsProps = {
  roomId: string;
  buildingId?: string;
};

const BookingRoomActions = ({
  roomId,
  buildingId,
}: BookingRoomActionsProps) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={space.sm}
      sx={{
        alignItems: "center",

        "& > *": {
          flex: 1,
          minWidth: 0,
        },
      }}
    >
      <Button
        component={Link}
        href={getRoomHref(roomId)}
        variant="outlined"
        startIcon={<MeetingRoomOutlinedIcon />}
        fullWidth
        sx={(theme) => ({
          height: theme.sizes.roomNavigation.buttonHeight,
          borderRadius: `${theme.radius.card}px`
        })}
      >
        View Room
      </Button>

      {buildingId && (
        <ViewOnMapButton buildingId={buildingId} variant="full-width" />
      )}
    </Stack>
  );
};

export default BookingRoomActions;
