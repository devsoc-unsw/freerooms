import { Box, Link } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Sponsor } from "types";

const LOGO_BOX = {
  Platinum: { height: 145, maxWidth: 540, pt: "28px", pb: "10px" },
  Gold: { height: 90, maxWidth: 315, pt: "18px", pb: "8px" },
} as const;

const GRID_SIZE = {
  Platinum: { xs: 12, sm: 6, md: 6 },
  Gold: { xs: 6, sm: 6, md: 6 },
} as const;

export default function SponsorItem({ name, image, url, tier }: Sponsor) {
  const box = LOGO_BOX[tier as keyof typeof LOGO_BOX];
  const size = GRID_SIZE[tier as keyof typeof GRID_SIZE];

  return (
    <Grid
      size={size}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href={url} target="_blank" sx={{ display: "block", width: "100%" }}>
        <Box
          sx={{
            width: "100%",
            height: box.height,
            maxWidth: box.maxWidth,
            mx: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
            boxSizing: "border-box",
            px: 2,
            pt: box.pt,
            pb: box.pb,
          }}
        >
          <Box
            component="img"
            src={image}
            alt={name}
            sx={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </Box>
      </Link>
    </Grid>
  );
}
