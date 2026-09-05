import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const RoomPageHeaderSkeleton = () => (
  <Stack
    direction="row"
    sx={{
      width: "100%",
      alignItems: "center",
      justifyContent: "space-between",
    }}
  >
    <Stack
      direction="column"
      spacing={1}
      sx={{ width: "100%", marginBottom: 1 }}
    >
      {/* RoomBackButton */}
      <Skeleton animation="wave" variant="rounded" width={80} height={36} />

      {/* building / usage breadcrumb */}
      <Stack direction="row" spacing={2}>
        <Skeleton animation="wave" variant="text" width={140} sx={{ fontSize: 14 }} />
        <Skeleton animation="wave" variant="text" width={90} sx={{ fontSize: 14 }} />
        <Skeleton animation="wave" variant="text" width={90} sx={{ fontSize: 14 }} />
      </Stack>

      {/* title row */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "start" },
          width: "100%",
        }}
      >
        <Skeleton animation="wave" variant="text" width="40%" sx={{ fontSize: 34 }} />

        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: "center", mt: { xs: 1, sm: 0 } }}
        >
          <Skeleton animation="wave" variant="circular" width={40} height={40} />
          <Skeleton
            animation="wave"
            variant="rounded"
            height={45}
            sx={{ width: { xs: "100%", sm: "160px" } }}
          />
          <Skeleton
            animation="wave"
            variant="rounded"
            height={45}
            sx={{ width: { xs: "100%", sm: "160px" } }}
          />
        </Stack>
      </Stack>

      {/* ID / capacity / abbreviation row */}
      <Stack direction="row" spacing={2}>
        <Skeleton animation="wave" variant="text" width={110} sx={{ fontSize: 16 }} />
        <Skeleton animation="wave" variant="text" width={110} sx={{ fontSize: 16 }} />
        <Skeleton animation="wave" variant="text" width={140} sx={{ fontSize: 16 }} />
        <Skeleton animation="wave" variant="text" width={180} sx={{ fontSize: 16 }} />
      </Stack>

      {/* rating row */}
      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
        <Skeleton animation="wave" variant="text" width={16} sx={{ fontSize: 16 }} />
        <Skeleton animation="wave" variant="rounded" width={110} height={20} />
      </Stack>
    </Stack>
  </Stack>
);

const BookingCalendarSkeleton = () => (
  <Stack sx={{ width: "100%", paddingTop: 3 }}>
    {/* "Room Bookings" title + date picker */}
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={1}
      sx={{ justifyContent: "space-between", width: "100%", paddingBottom: 2 }}
    >
      <Skeleton animation="wave" variant="text" width={160} sx={{ fontSize: 24 }} />

      <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
        {/* Previous day (mobile only) */}
        <Skeleton
          animation="wave"
          variant="circular"
          width={40}
          height={40}
          sx={{ display: { xs: "block", md: "none" } }}
        />
        {/* Day (date picker) */}
        <Skeleton
          animation="wave"
          variant="rounded"
          height={40}
          sx={{ width: { xs: "100%", md: 200 } }}
        />
        {/* Next day (mobile only) */}
        <Skeleton
          animation="wave"
          variant="circular"
          width={40}
          height={40}
          sx={{ display: { xs: "block", md: "none" } }}
        />
      </Stack>
    </Stack>

    {/* Previous / Today / Next + Week / Day toggle (desktop only) */}
    <Stack
      direction="row"
      sx={{
        justifyContent: "space-between",
        marginBottom: 2,
        display: { xs: "none", md: "flex" },
      }}
    >
      <Skeleton animation="wave" variant="rounded" width={200} height={30} />
      <Skeleton animation="wave" variant="rounded" width={110} height={30} />
    </Stack>

    <Skeleton
      animation="wave"
      variant="rounded"
      width="100%"
      height={500}
      sx={{ borderRadius: "12px" }}
    />
  </Stack>
);

const RoomUtilityTagsSkeleton = () => (
  <Stack sx={{ width: "100%", pt: 6, pb: 3, gap: 1 }}>
    <Skeleton animation="wave" variant="text" width={180} sx={{ fontSize: 24, mb: 2 }} />
    {Array.from({ length: 4 }, (_, i) => (
      <Skeleton key={i} animation="wave" variant="rounded" height={48} />
    ))}
  </Stack>
);

const RoomRatingSkeleton = () => (
  <Stack sx={{ width: "100%", alignSelf: "start" }}>
    <Skeleton animation="wave" variant="text" width={160} sx={{ fontSize: 24, mt: 3, mb: 1 }} />

    <Stack direction={{ xs: "column", sm: "row" }} sx={{ gap: 4, alignItems: "center" }}>
      {/* DecimalStarRating: overall rating box */}
      <Stack sx={{ alignItems: "center", gap: 0.25, pb: 2 }}>
        <Skeleton animation="wave" variant="text" width={70} sx={{ fontSize: 75 }} />
        <Skeleton animation="wave" variant="rounded" width={120} height={24} />
      </Stack>

      {/* three CircularRating circles: Cleanliness / Location / Quietness */}
      <Stack direction="row">
        {Array.from({ length: 3 }, (_, i) => (
          <Stack key={i} sx={{ alignItems: "center", mx: 1 }}>
            <Skeleton animation="wave" variant="text" width={80} sx={{ fontSize: 16 }} />
            <Skeleton animation="wave" variant="circular" width={100} height={100} />
          </Stack>
        ))}
      </Stack>

      <Divider
        flexItem
        orientation="vertical"
        sx={{ display: { xs: "none", sm: "block" } }}
      />

      {/* "Share your thoughts" + Leave a Rating button */}
      <Stack sx={{ gap: 1, justifyContent: "center" }}>
        <Skeleton animation="wave" variant="text" width={180} sx={{ fontSize: 16 }} />
        <Skeleton animation="wave" variant="rounded" width={180} height={36} />
      </Stack>
    </Stack>
  </Stack>
);

export default function RoomPageSkeleton() {
  return (
    <Stack
      sx={{
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingTop: 5,
        paddingBottom: 5,
        height: "100%",
        paddingLeft: { xs: 3, md: 15 },
        paddingRight: { xs: 3, md: 15 },
      }}
    >
      <RoomPageHeaderSkeleton />
      <Skeleton
        animation="wave"
        variant="rounded"
        width="100%"
        height={500}
        sx={{ borderRadius: "10px" }}
      />
      <BookingCalendarSkeleton />
      <RoomUtilityTagsSkeleton />
      <RoomRatingSkeleton />
    </Stack>
  );
}
