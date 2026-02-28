import { Divider, Stack, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Image from "next/image";
import { Sponsor } from "types";

import SponsorItem from "./SponsorItem";

export default function Sponsors() {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";

  const sponsors: Sponsor[] = [
    {
      name: "Hudon River Trading",
      tier: "Platinum",
      image: isLightMode
        ? "/assets/sponsors/hrt.png"
        : "/assets/sponsors/hrt.png",
      url: "https://www.hudsonrivertrading.com",
    },
    {
      name: "The Trade Desk",
      tier: "Platinum",
      image: isLightMode
        ? "/assets/sponsors/theTradeDesk.png"
        : "/assets/sponsors/thetradedesk_dark.png",
      url: "https://careers.thetradedesk.com/",
    },
    {
      name: "Jane Street",
      tier: "Platinum",
      image: isLightMode
        ? "/assets/sponsors/jane_street.png"
        : "/assets/sponsors/jane_street_dark.svg",
      url: "https://www.janestreet.com/",
    },
    {
      name: "Lyra",
      tier: "Platinum",
      image: isLightMode
        ? "/assets/sponsors/lyra-dark.svg"
        : "/assets/sponsors/lyra-light.svg",
      url: "https://lyratechnologies.com.au",
    },
    {
      name: "Arista",
      tier: "Gold",
      image: isLightMode
        ? "/assets/sponsors/arista.png"
        : "/assets/sponsors/arista_dark.png",
      url: "https://www.arista.com/en/",
    },
    {
      name: "Airwallex",
      tier: "Gold",
      image: isLightMode
        ? "/assets/sponsors/airwallex-dark.png"
        : "/assets/sponsors/airwallex-light.png",
      url: "https://www.airwallex.com/au",
    },
    {
      name: "Atlassian",
      tier: "Gold",
      image: isLightMode
        ? "/assets/sponsors/atlassian.png"
        : "/assets/sponsors/atlassian.png",
      url: "https://www.atlassian.com/",
    },
    {
      name: "QRT",
      tier: "Gold",
      image: isLightMode
        ? "/assets/sponsors/qrt-dark.png"
        : "/assets/sponsors/qrt.svg",
      url: "https://www.qube-rt.com/",
    },
  ];
  const platinumSponsors = sponsors.filter(
    (sponsor) => sponsor.tier === "Platinum"
  );

  const goldSponsors = sponsors.filter((sponsor) => sponsor.tier === "Gold");

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
        rowSpacing={3}
        columnSpacing={{ xs: 2, sm: 6 }}
        columns={12}
        sx={{
          mt: 5,
          backgroundColor: isLightMode
            ? "#ffffff"
            : theme.palette.background?.paper,
          padding: "30px",
          paddingTop: "0px",
          borderRadius: "10px",
        }}
      >
        {platinumSponsors.map((s, idx) => (
          <SponsorItem
            key={`platinum-${idx}`}
            name={s.name}
            image={s.image}
            url={s.url}
            tier={s.tier}
          />
        ))}

        <Grid size={12}>
          <Divider />
        </Grid>

        {goldSponsors.map((s, idx) => (
          <SponsorItem
            key={`gold-${idx}`}
            name={s.name}
            image={s.image}
            url={s.url}
            tier={s.tier}
          />
        ))}
      </Grid>
    </Stack>
  );
}
