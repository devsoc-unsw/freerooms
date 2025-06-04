import { Chip, Stack } from "@mui/material";

interface Props {
  items: string[];
}

export default function UtilityChips({ items }: Props) {
  const ORANGE = "#f57d04";

  return (
    <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.75 }}>
      {items.map((item, index) => (
        <Chip
          key={index}
          label={item}
          size="small"
          sx={{
            fontSize: "0.75rem",
            height: 26,
            backgroundColor: "#f9f9f9",
            color: "#424242",
            border: "1px solid #e0e0e0",
            "&:hover": {
              backgroundColor: "#fef7f0",
              borderColor: ORANGE,
              transform: "translateY(-1px)",
              boxShadow: "0 2px 4px rgba(245, 125, 4, 0.15)",
            },
            transition: "all 0.2s ease-in-out",
            "& .MuiChip-label": {
              px: 1.5,
              fontWeight: "medium",
            },
          }}
        />
      ))}
    </Stack>
  );
}
