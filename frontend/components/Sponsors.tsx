import { Stack, Typography } from "@mui/material";
import Image from "next/image";
import { Sponsor } from "types";

import SponsorItem from "./SponsorItem";

export default function Sponsors() {
  const sponsors: Sponsor[] = [
    {
      name: "TikTok",
      image: "/assets/sponsors/tiktok.png",
      url: "https://careers.tiktok.com/",
    },
    {
      name: "Jane Street",
      image: "/assets/sponsors/jane_street.png",
      url: "https://www.janestreet.com/",
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
      <Stack
        alignItems="center"
        gap={5}
        marginTop={5}
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
    </Stack>
  );
}
