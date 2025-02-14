import { Stack, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Image from "next/image";
import { Sponsor } from "types";

import SponsorItem from "./SponsorItem";

export default function Sponsors() {
  const sponsors: Sponsor[] = [
    {
      name: "Arista",
      tier: "Platinum",
      image: "/assets/sponsors/arista.png",
      url: "https://www.arista.com/en/",
    },
    {
      name: "The Trade Desk",
      image: "/assets/sponsors/theTradeDesk.png",
      tier: "Platinum",
      url: "https://careers.thetradedesk.com/",
    },
    {
      name: "SafetyCulture",
      tier: "Gold",
      image: "/assets/sponsors/jane_street.png",
      url: "https://safetyculture.com/",
    },
    {
      name: "Jane Street",
      tier: "Gold",
      image: "/assets/sponsors/safetyculture.png",
      url: "https://www.janestreet.com/",
    },
  ];
  const theme = useTheme();

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
          backgroundColor: "white",
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
