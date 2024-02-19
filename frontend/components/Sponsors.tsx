import { Box, Stack, Typography } from "@mui/material";
import { Sponsor } from "types";

import SponsorItem from "./SponsorItem";

export default function Sponsors() {
  const sponsors: Sponsor[] = [
    {
      name: "TikTok",
      image: "/assets/sponsors/tiktok.png",
      url: "https://www.tiktok.com/about?lang=en",
    },
    {
      name: "Jane Street",
      image: "/assets/sponsors/jane_street.png",
      url: "https://www.janestreet.com/",
    },
  ];

  return (
    <Box marginTop={4}>
      <Typography align="center" variant="h6">
        Our Sponsors
      </Typography>
      <Stack
        gap={5}
        marginTop={2}
        sx={{ flexDirection: { xs: "stack", sm: "row" } }}
      >
        {sponsors.map((s, idx) => (
          <SponsorItem
            key={idx}
            name={s.name}
            image={s.image}
            url={s.url}
          ></SponsorItem>
        ))}
      </Stack>
    </Box>
  );
}
