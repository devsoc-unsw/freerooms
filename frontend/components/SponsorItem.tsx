import { Box, Link } from "@mui/material";
import { Sponsor } from "types";
import Grid from "@mui/material/Grid2";

export default function SponsorItem({ name, image, url, tier }: Sponsor) {
  if (tier === "Platinum") {
    return (
      <Grid
        size={{ xs: 12, sm: 6, md: 6, lg: 6 }}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Link href={url} target="_blank">
          <Box alt={name} component="img" src={image} sx={{ height: 30 }}></Box>
        </Link>
      </Grid>
    );
  }
  return (
    <Grid
      size={{ xs: 3, sm: 6, md: 6, lg: 6 }}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href={url} target="_blank">
        <Box alt={name} component="img" src={image} sx={{ height: 40 }}></Box>
      </Link>
    </Grid>
  );
}
