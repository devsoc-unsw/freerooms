import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import UtilityChips from "./UtilityChips";

interface Props {
  title: string;
  icon: React.ReactNode;
  items: string[];
}

export default function UtilityAccordion({ title, icon, items = [] }: Props) {
  const theme = useTheme();
  const primary = theme.palette.primary.main;

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: `${theme.shape.borderRadius}px !important`,
        overflow: "hidden",
        mb: theme.spacing(1),
        "&:before": {
          display: "none",
        },
        "&:hover": {
          borderColor: primary,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore sx={{ color: primary }} />}
        sx={{
          backgroundColor: theme.palette.common.white,
          transition: "background-color 0.3s",
          "&:hover": {
            backgroundColor: theme.palette.common.white,
            backgroundImage: `linear-gradient(${alpha(primary, 0.08)}, ${alpha(primary, 0.08)})`,
          },
          "&.Mui-expanded": {
            backgroundColor: theme.palette.common.white,
            backgroundImage: `linear-gradient(${alpha(primary, 0.08)}, ${alpha(primary, 0.08)})`,
          },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          {icon}
          <Typography
            variant="subtitle2"
            fontWeight={theme.typography.fontWeightMedium}
            color="text.primary"
          >
            {title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: primary,
              backgroundColor: `${primary}1A`, // ~10% opacity
              px: theme.spacing(1),
              py: theme.spacing(0.25),
              borderRadius: theme.shape.borderRadius,
              fontWeight: theme.typography.fontWeightMedium,
            }}
          >
            {items.length}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          p: theme.spacing(2),
          backgroundColor: theme.palette.background.default,
        }}
      >
        <UtilityChips items={items} />
      </AccordionDetails>
    </Accordion>
  );
}
