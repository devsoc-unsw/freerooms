import CloseIcon from "@mui/icons-material/Close";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

import type { RouteSummary } from "../hooks/useMapboxRoute";

type DirectionsSummaryProps = {
  summary: RouteSummary;
  onClose: () => void;
};

const SummaryContainer = styled(Paper)(({ theme }) => ({
  position: "absolute",
  left: "50%",
  bottom: theme.spacing(3),
  zIndex: 10,
  transform: "translateX(-50%)",

  width: "min(420px, calc(100% - 32px))",
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),

  boxShadow: theme.shadows[6],

  [theme.breakpoints.down("sm")]: {
    bottom: theme.spacing(2),
    width: `calc(100% - ${theme.spacing(3)})`,
  },
}));

const WalkingIconContainer = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  width: 42,
  height: 42,
  flexShrink: 0,

  borderRadius: "50%",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

// Converts route secionds to readable format
const formatDuration = (durationSeconds: number): string => {
  const minutes = Math.max(1, Math.ceil(durationSeconds / 60));

  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
};

const formatDistance = (distanceMeters: number): string => {
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)} m`;
  }

  return `${(distanceMeters / 1000).toFixed(1)} km`;
};

// Displays info about current route
const DirectionsSummary = ({ summary, onClose }: DirectionsSummaryProps) => {
  return (
    <SummaryContainer elevation={6}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
        <WalkingIconContainer>
          <DirectionsWalkIcon />
        </WalkingIconContainer>

        <Stack
          spacing={0.25}
          sx={{
            minWidth: 0,
            flexGrow: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {formatDuration(summary.durationSeconds)} (
            {formatDistance(summary.distanceMeters)})
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            title={summary.destinationName}
          >
            Walking to {summary.destinationName}
          </Typography>
        </Stack>

        <IconButton
          aria-label="Close directions"
          onClick={onClose}
          size="small"
        >
          <CloseIcon />
        </IconButton>
      </Stack>
    </SummaryContainer>
  );
};

export default DirectionsSummary;
