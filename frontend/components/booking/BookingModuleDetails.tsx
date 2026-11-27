import { AppSurface } from "@frontend/components/ui/AppSurface";
import { space } from "@frontend/theme";
import {
  formatBookingCareer,
  formatBookingTerm,
} from "@frontend/utils/bookingFormatting";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { Box, Divider, Stack, Typography } from "@mui/material";
import type { BookingListModule } from "common/types";

type BookingModuleDetailsProps = {
  modules: BookingListModule[];
};

const BookingModuleDetails = ({ modules }: BookingModuleDetailsProps) => {
  const validModules = modules
    .map((module) => ({
      code: module.code?.trim(),
      name: module.name?.trim(),
      term: formatBookingTerm(module.term),
      career: formatBookingCareer(module.career),
    }))
    .filter(
      (module) => module.code || module.name || module.term || module.career
    );

  if (validModules.length === 0) {
    return null;
  }

  return (
    <AppSurface
      sx={(theme) => ({
        padding: theme.space.md,
      })}
    >
      <Stack spacing={space.md}>
        <Typography variant="cardTitle" component="h2">
          Course and module information
        </Typography>

        <Stack spacing={space.md} divider={<Divider flexItem />}>
          {validModules.map((module, index) => (
            <Stack key={index} spacing={space.xs}>
              {module.code && (
                <Typography
                  variant="subtitle1"
                  sx={(theme) => ({
                    color: theme.colours.accent.primary,
                    overflowWrap: "anywhere",
                  })}
                >
                  {module.code}
                </Typography>
              )}

              {module.name && (
                <Typography variant="body1" sx={{ overflowWrap: "anywhere" }}>
                  {module.name}
                </Typography>
              )}

              {(module.term || module.career) && (
                <Box
                  sx={(theme) => ({
                    display: "flex",
                    flexWrap: "wrap",
                    columnGap: theme.space.md,
                    rowGap: theme.space.xs,
                    color: theme.colours.text.secondary,
                  })}
                >
                  {module.term && (
                    <Stack
                      direction="row"
                      spacing={space.xs}
                      sx={{ alignItems: "center" }}
                    >
                      <CalendarTodayOutlinedIcon
                        sx={(theme) => ({
                          fontSize: theme.sizes.icon.sm,
                        })}
                      />

                      <Typography variant="body2">{module.term}</Typography>
                    </Stack>
                  )}

                  {module.career && (
                    <Stack
                      direction="row"
                      spacing={space.xs}
                      sx={{ alignItems: "center" }}
                    >
                      <SchoolOutlinedIcon
                        sx={(theme) => ({
                          fontSize: theme.sizes.icon.sm,
                        })}
                      />

                      <Typography variant="body2">{module.career}</Typography>
                    </Stack>
                  )}
                </Box>
              )}
            </Stack>
          ))}
        </Stack>
      </Stack>
    </AppSurface>
  );
};

export default BookingModuleDetails;
