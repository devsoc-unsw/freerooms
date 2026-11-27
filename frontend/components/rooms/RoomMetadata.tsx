import type { SvgIconComponent } from "@mui/icons-material";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import MeetingRoomOutlinedIcon from "@mui/icons-material/MeetingRoomOutlined";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";
import { Box, Typography } from "@mui/material";
import translateRoomUsage from "common/roomUsages";
import getSchoolDetails from "common/schools";
import type { Room } from "common/types";

type RoomMetadataProps = {
  room: Room;
  rating?: number;
};

type MetadataItemProps = {
  icon: SvgIconComponent;
  label: string;
  value: string | number;
};

const MetadataItem = ({ icon: Icon, label, value }: MetadataItemProps) => (
  <Box
    sx={(theme) => ({
      display: "inline-flex",
      alignItems: "center",
      gap: theme.space.xs,
      color: theme.colours.text.secondary,
    })}
  >
    <Icon
      sx={(theme) => ({
        fontSize: theme.sizes.icon.sm,
        flexShrink: 0,
      })}
    />

    <Typography variant="body2" component="span">
      {label}: {value}
    </Typography>
  </Box>
);

const RoomMetadata = ({ room, rating }: RoomMetadataProps) => {
  const school = room.school.trim();
  const schoolDetails = getSchoolDetails(school);
  const idRequired = school !== "";

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        flexWrap: "wrap",
        columnGap: theme.space.md,
        rowGap: theme.space.sm,
      })}
    >
      <MetadataItem icon={TagOutlinedIcon} label="ID" value={room.id} />

      <MetadataItem
        icon={GroupOutlinedIcon}
        label="Capacity"
        value={room.capacity > 0 ? room.capacity : "Unknown"}
      />

      <MetadataItem
        icon={MeetingRoomOutlinedIcon}
        label="Room"
        value={translateRoomUsage(room.usage) ?? "Unknown"}
      />

      <MetadataItem
        icon={StarBorderIcon}
        label="Stars"
        value={
          rating === undefined
            ? "Unavailable"
            : rating > 0
              ? rating.toFixed(1)
              : "Not rated"
        }
      />

      <MetadataItem
        icon={BadgeOutlinedIcon}
        label="ID Required"
        value={idRequired ? "Yes" : "No"}
      />

      {idRequired && (
        <MetadataItem
          icon={ApartmentOutlinedIcon}
          label="School"
          value={schoolDetails?.name ?? school}
        />
      )}
    </Box>
  );
};

export default RoomMetadata;
