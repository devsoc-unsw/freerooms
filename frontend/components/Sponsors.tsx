import { Stack, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Image from "next/image";
import { Sponsor } from "types";

import SponsorItem from "./SponsorItem";

export default function Sponsors() {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";

  const sponsors: Sponsor[] = [
    {
      name: "Arista",
      tier: "Platinum",
      image: isLightMode
        ? "/assets/sponsors/arista.png"
        : "/assets/sponsors/arista_dark.png",
      url: "https://www.arista.com/en/",
    },
    {
      name: "The Trade Desk",
      image: isLightMode
        ? "/assets/sponsors/theTradeDesk.png"
        : "/assets/sponsors/thetradedesk_dark.png",
      tier: "Platinum",
      url: "https://careers.thetradedesk.com/",
    },
    {
      name: "Jane Street",
      tier: "Gold",
      image: isLightMode
        ? "/assets/sponsors/jane_street.png"
        : "/assets/sponsors/jane_street_dark.svg",
      url: "https://www.janestreet.com/",
    },
    {
      name: "SafetyCulture",
      tier: "Gold",
      image: isLightMode
        ? "/assets/sponsors/safetyculture.png"
        : "/assets/sponsors/sc_dark.png",
      url: "https://safetyculture.com/",
    },
  ];

  return (
    <Stack marginTop={4}>
      <Typography
        align="center"
        variant="h1"
        sx={{ fontSize: "3rem", fontWeight: "bold" }}
      >
        Our Sponsors
      </Typography>
      <Image
        alt="Underline Vector"
        src="/assets/landing_page/underline_vector.png"
        height={12}
        width={200}
        style={{
          alignSelf: "center",
          marginTop: 5,
        }}
      />
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        marginTop={5}
        rowSpacing={6}
        columns={12}
        sx={{
          mt: 5,
          flexDirection: { xs: "column", sm: "row" },
          backgroundColor: theme.palette.background.paper,
          padding: "30px",
          borderRadius: "10px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {sponsors.map((s, idx) => (
          <SponsorItem
            key={idx}
            name={s.name}
            image={s.image}
            url={s.url}
            tier={s.tier}
          ></SponsorItem>
        ))}
      </Grid>
    </Stack>
  );
}
