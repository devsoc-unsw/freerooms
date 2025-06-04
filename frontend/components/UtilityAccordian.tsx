import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Stack,
  Typography,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import UtilityChips from "./UtilityChips";

interface Props {
  title: string;
  icon: React.ReactNode;
  items: string[];
}

export default function UtilityAccordion({ title, icon, items = [] }: Props) {
  const ORANGE = "#f57d04";

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: "8px !important",
        overflow: "hidden",
        "&:before": {
          display: "none",
        },
        mb: 1,
        "&:hover": {
          borderColor: ORANGE,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore sx={{ color: ORANGE }} />}
        sx={{
          backgroundColor: "#fafafa",
          "&:hover": {
            backgroundColor: "#f5f5f5",
          },
          "&.Mui-expanded": {
            backgroundColor: "#fef7f0",
          },
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          {icon}
          <Typography
            variant="subtitle2"
            fontWeight="medium"
            color="text.primary"
          >
            {title}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: ORANGE,
              backgroundColor: "#fef7f0",
              px: 1,
              py: 0.25,
              borderRadius: 1,
              fontWeight: "medium",
            }}
          >
            {items.length}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 2, backgroundColor: "#fefefe" }}>
        <UtilityChips items={items} />
      </AccordionDetails>
    </Accordion>
  );
}
