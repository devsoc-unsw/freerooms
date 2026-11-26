import { AppSurface } from "@frontend/components/ui/AppSurface";
import { space } from "@frontend/theme";
import { getPlannedAttendance } from "@frontend/utils/bookingFormatting";
import { LinearProgress, Stack, Typography } from "@mui/material";

type BookingAttendanceProps = {
  plannedSize?: number | null;
  capacity?: number | null;
};

const BookingAttendance = ({
  plannedSize,
  capacity,
}: BookingAttendanceProps) => {
  const attendance = getPlannedAttendance(plannedSize);

  const roomCapacity =
    typeof capacity === "number" && Number.isFinite(capacity) && capacity > 0
      ? capacity
      : undefined;

  const percentage =
    attendance !== undefined && roomCapacity !== undefined
      ? (attendance / roomCapacity) * 100
      : undefined;

  const overCapacity = percentage !== undefined && percentage > 100;

  return (
    <AppSurface
      sx={(theme) => ({
        padding: theme.space.md,
      })}
    >
      <Stack spacing={space.sm}>
        <Typography variant="cardTitle" component="h2">
          Planned attendance
        </Typography>

        {attendance === undefined ? (
          <Typography color="text.secondary">Not specified</Typography>
        ) : (
          <>
            <Stack
              direction="row"
              spacing={space.sm}
              sx={{
                alignItems: "baseline",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <Stack
                direction="row"
                spacing={space.xs}
                sx={{ alignItems: "baseline" }}
              >
                <Typography variant="h3">{attendance}</Typography>

                {roomCapacity !== undefined && (
                  <Typography color="text.secondary">
                    / {roomCapacity}
                  </Typography>
                )}
              </Stack>

              {percentage !== undefined && (
                <Typography
                  variant="h4"
                  sx={(theme) => ({
                    color: overCapacity
                      ? theme.colours.status.unavailable.text
                      : theme.colours.accent.primary,
                  })}
                >
                  {Math.round(percentage)}%
                </Typography>
              )}
            </Stack>

            {percentage !== undefined && (
              <LinearProgress
                variant="determinate"
                value={Math.min(percentage, 100)}
                aria-label="Planned attendance as a percentage of room capacity"
                aria-valuetext={`${Math.round(percentage)}% of room capacity`}
                sx={(theme) => ({
                  height: theme.space.sm,
                  borderRadius: `${theme.radius.pill}px`,
                  backgroundColor: overCapacity
                    ? theme.colours.status.unavailable.background
                    : theme.colours.accent.quaternary,

                  "& .MuiLinearProgress-bar": {
                    backgroundColor: overCapacity
                      ? theme.colours.status.unavailable.main
                      : theme.colours.accent.primary,
                    borderRadius: `${theme.radius.pill}px`,
                  },
                })}
              />
            )}
          </>
        )}
      </Stack>
    </AppSurface>
  );
};

export default BookingAttendance;
