import { Box, Link } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Sponsor } from "types";

export default function SponsorItem({ name, image, url, tier }: Sponsor) {
  const isPlatinum = tier === "Platinum";
  const isGold = tier === "Gold";

  return (
    <Grid
      size={
        isPlatinum
          ? { xs: 12, sm: 6 }
          : isGold
            ? { xs: 6, sm: 4 }
            : { xs: 6, sm: 3 }
      }
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href={url} target="_blank">
        <Box
          sx={{
            width: isPlatinum ? 220 : isGold ? 160 : 120,
            height: isPlatinum ? 120 : isGold ? 90 : 60,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
            }}
          />
        </Box>
      </Link>
    </Grid>
  );
}
