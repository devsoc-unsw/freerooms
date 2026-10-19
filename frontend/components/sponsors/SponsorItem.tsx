import { Sponsor } from "@frontend/types";
import { Box, Link } from "@mui/material";
import Grid from "@mui/material/Grid";

const LOGO_BOX = {
  Platinum: { height: 145, maxWidth: 540 },
  Gold: { height: 90, maxWidth: 315},
} as const;

const GRID_SIZE = {
  Platinum: { xs: 12, md: 6 },
  Gold: { xs: 12, sm: 6, lg: 3 },
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
      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: "block",
          width: "100%",

          // Float on mouse hover
          "@media (hover: hover) and (pointer: fine)": {
            "&:hover .sponsor-logo": {
              transform: "translateY(-6px) scale(1.025)"
            },
          },

          // float on keyboard hover
          "&:focus-visible .sponsor-logo": {
            transform: "translateY(-6px) scale(1.025)"
          },

          // Disable for reduced motion
          "@media (prefers-reduced-motion: reduce)": {
            "&:hover .sponsor-logo &:focus-visible .sponsor-logo": {
              transform: "none"
            },
          },
        }}
      >
        <Box
          className="sponsor-logo"
          sx={{
            width: "100%",
            height: box.height,
            maxWidth: box.maxWidth,
            mx: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            boxSizing: "border-box",
            px: 2,

            // Smooth animation
            transition: "transform 250ms ease-out",

            // No motion for prefer reduce
            "@media (prefers-reduced-motion: reduce)": {
              transition: "none"
            }
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
