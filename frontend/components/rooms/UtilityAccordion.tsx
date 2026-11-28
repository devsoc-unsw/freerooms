import UtilityChips from "@frontend/components/rooms/UtilityChips";
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
        border: `${theme.sizes.border.weight}px solid ${theme.colours.border.subtle}`,
        borderRadius: `${theme.radius.md}px !important`,
        overflow: "hidden",
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
          backgroundColor: theme.palette.background.default,
          transition: "background-color 0.3s",
          "&:hover": {
            backgroundColor: theme.palette.background.default,
            backgroundImage: `linear-gradient(${alpha(primary, 0.08)}, ${alpha(primary, 0.08)})`,
          },
          "&.Mui-expanded": {
            backgroundColor: theme.palette.background.default,
            backgroundImage: `linear-gradient(${alpha(primary, 0.08)}, ${alpha(primary, 0.08)})`,
          },
        }}
      >
        <Stack
          direction="row"
          spacing={theme.space.sm}
          sx={{
            alignItems: "center",
          }}
        >
          {icon}
          <Typography
            variant="filterTitle"
            color="text.primary"
            sx={{
              fontWeight: theme.typography.fontWeightMedium,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: primary,
              backgroundColor: alpha(primary, 0.1),
              paddingInline: theme.space.sm,
              paddingBlock: theme.space.xs,
              borderRadius: `${theme.radius.pill}px`,
              fontWeight: theme.typography.fontWeightMedium,
            }}
          >
            {items.length}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: theme.space.md,
          backgroundColor: theme.palette.background.default,
        }}
      >
        <UtilityChips items={items} />
      </AccordionDetails>
    </Accordion>
  );
}
