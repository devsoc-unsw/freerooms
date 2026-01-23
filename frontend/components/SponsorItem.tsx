import { Box, Link } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Sponsor } from "types";

export default function SponsorItem({ name, image, url, tier }: Sponsor) {
  const isPlatinum = tier === "Platinum";

  return (
    <Grid
      size={isPlatinum ? { xs: 12, sm: 6 } : { xs: 6, sm: 4 }}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href={url} target="_blank">
        <Box
          sx={{
            width: isPlatinum ? 220 : 180,
            height: isPlatinum ? 120 : 90,
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
