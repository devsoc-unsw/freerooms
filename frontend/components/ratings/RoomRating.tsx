import { Divider, Skeleton, Typography } from "@mui/material";
import { Stack, useMediaQuery } from "@mui/system";

import ReviewButton from "./ReviewButton";
import RoomRatingList from "./RoomRatingList";

interface RoomRatingProps {
  buildingID: string;
  roomID: string;
  loading?: boolean;
}

const RoomRatingSkeleton = () => (
  <Stack direction="column" sx={{ width: "100%", alignSelf: "start", gap: 2 }}>
    {/* "Room Ratings" heading */}
    <Skeleton
      animation="wave"
      variant="text"
      width={160}
      sx={{ fontSize: 24, mt: 3, mb: 1 }}
    />

    {/* column on mobile, row (with vertical divider) from 675px */}
    <Stack
      sx={{
        flexDirection: "column",
        gap: 2,
        "@media (min-width:675px)": {
          flexDirection: "row",
          alignItems: "center",
        },
      }}
    >
      {/* RoomRatingList: DecimalStarRating + circles (>=970px) / linear bars (<970px) */}
      <Stack
        sx={{
          flexDirection: "column",
          gap: 5,
          alignItems: "center",
          width: "100%",
          "@media (min-width:970px)": { flexDirection: "row", width: "auto" },
        }}
      >
        {/* DecimalStarRating: overall rating value + stars */}
        <Stack sx={{ alignItems: "center", gap: 1, pb: 2 }}>
          <Skeleton
            animation="wave"
            variant="text"
            width={70}
            sx={{ fontSize: 75 }}
          />
          <Skeleton
            animation="wave"
            variant="rounded"
            width={120}
            height={24}
          />
        </Stack>

        {/* >=970px: Cleanliness / Location / Quietness circles */}
        <Stack
          direction="row"
          sx={{
            display: "none",
            "@media (min-width:970px)": { display: "flex" },
          }}
        >
          {Array.from({ length: 3 }, (_, i) => (
            <Stack key={i} sx={{ alignItems: "center", mx: 1 }}>
              <Skeleton
                animation="wave"
                variant="text"
                width={80}
                sx={{ fontSize: 16 }}
              />
              <Skeleton
                animation="wave"
                variant="circular"
                width={100}
                height={100}
              />
            </Stack>
          ))}
        </Stack>

        {/* <970px: 3 LinearRating bars */}
        <Stack
          sx={{
            gap: 2,
            marginTop: 2,
            width: "100%",
            "@media (min-width:970px)": { display: "none" },
          }}
        >
          {Array.from({ length: 3 }, (_, i) => (
            <Stack key={i} direction="column">
              <Skeleton animation="wave" variant="text" width="20%" />
              <Skeleton animation="wave" variant="text" width="100%" />
            </Stack>
          ))}
        </Stack>
      </Stack>

      {/* vertical divider from 675px */}
      <Divider
        flexItem
        orientation="vertical"
        sx={{
          display: "none",
          "@media (min-width:675px)": { display: "block" },
        }}
      />

      {/* "Share your thoughts" + ReviewButton */}
      <Stack
        sx={{
          gap: 0.5,
          justifyContent: "center",
          width: "100%",
          "@media (min-width:675px)": { width: "auto" },
        }}
      >
        <Skeleton
          animation="wave"
          variant="text"
          sx={{
            fontSize: 16,
            display: "none",
            width: 180,
            "@media (min-width:675px)": { display: "block" },
          }}
        />
        <Skeleton
          animation="wave"
          variant="rounded"
          height={36}
          sx={{ width: "100%" }}
        />
      </Stack>
    </Stack>
  </Stack>
);

export default function RoomRating({
  buildingID,
  roomID,
  loading,
}: RoomRatingProps) {
  const isDesktop = useMediaQuery("(min-width: 675px)");

  if (loading) {
    return <RoomRatingSkeleton />;
  }

  return (
    <Stack
      sx={{
        alignSelf: "start",
        width: "100%",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          marginTop: 3,
        }}
      >
        Room Ratings
      </Typography>
      {isDesktop ? (
        <Stack
          direction="row"
          sx={{
            gap: 2,
          }}
        >
          <RoomRatingList roomID={roomID} />
          <Divider flexItem orientation="vertical" />
          <Stack
            sx={{
              gap: 1,
              justifyContent: "center",
            }}
          >
            <Typography>Share your thoughts on this room!</Typography>
            <ReviewButton buildingID={buildingID} roomID={roomID} />
          </Stack>
        </Stack>
      ) : (
        <Stack
          sx={{
            gap: 2,
            justifySelf: "center",
          }}
        >
          <RoomRatingList roomID={roomID} />
          <ReviewButton buildingID={buildingID} roomID={roomID} />
        </Stack>
      )}
    </Stack>
  );
}
