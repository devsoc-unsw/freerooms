import { Stack, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Image from "next/image";
import { Sponsor } from "types";

import SponsorItem from "./SponsorItem";

export default function Sponsors() {
  const sponsors: Sponsor[] = [
    {
      name: "Arista",
      image: "/assets/sponsors/arista.png",
      url: "https://www.arista.com/en/",
    },
    {
      name: "The Trade Desk",
      image: "/assets/sponsors/theTradeDesk.svg",
      url: "https://careers.thetradedesk.com/",
    },
    {
      name: "Jane Street",
      image: "/assets/sponsors/jane_street.png",
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
        spacing={5}
        marginTop={5}
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
          <Grid
            size={{ xs: 12, sm: 8, md: 8, lg: 6 }}
            key={idx}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <SponsorItem
              name={s.name}
              image={s.image}
              url={s.url}
            ></SponsorItem>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
