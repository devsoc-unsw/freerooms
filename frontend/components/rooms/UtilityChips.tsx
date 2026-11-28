import { Chip, Stack, useTheme } from "@mui/material";

interface Props {
  items: string[];
}

export default function UtilityChips({ items }: Props) {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      useFlexGap
      sx={{
        flexWrap: "wrap",
        gap: theme.space.sm,
      }}
    >
      {items.map((item, index) => (
        <Chip
          key={index}
          label={item}
          size="small"
          sx={{
            fontSize: theme.typography.pxToRem(12),
            height: 26,
            maxWidth: "100%",
            backgroundColor: theme.colours.surface.muted,
            color: theme.palette.text.primary,
            border: `${theme.sizes.border.weight}px solid ${theme.colours.border.subtle}`,
            borderRadius: `${theme.radius.pill}px`,

            "& .MuiChip-label": {
              paddingInline: theme.space.sm,
              fontWeight: theme.typography.fontWeightMedium,
            },
          }}
        />
      ))}
    </Stack>
  );
}
