import { Chip, Stack, useTheme } from "@mui/material";

interface Props {
  items: string[];
}

export default function UtilityChips({ items }: Props) {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{ flexWrap: "wrap", gap: theme.spacing(0.75) }}
    >
      {items.map((item, index) => (
        <Chip
          key={index}
          label={item}
          size="small"
          sx={{
            fontSize: theme.typography.pxToRem(12),
            height: 26,
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.divider}`,
            "&:hover": {
              backgroundColor: theme.palette.action.hover,
              borderColor: theme.palette.warning.main,
              transform: "translateY(-1px)",
              boxShadow: `0 2px 4px ${theme.palette.warning.main}33`, // 33 = 20% opacity
            },
            transition: theme.transitions.create(
              ["background-color", "border", "transform", "box-shadow"],
              {
                duration: theme.transitions.duration.short,
                easing: theme.transitions.easing.easeInOut,
              }
            ),
            "& .MuiChip-label": {
              paddingLeft: theme.spacing(1.5),
              paddingRight: theme.spacing(1.5),
              fontWeight: theme.typography.fontWeightMedium,
            },
          }}
        />
      ))}
    </Stack>
  );
}
