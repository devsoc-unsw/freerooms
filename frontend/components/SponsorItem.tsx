import Box from "@mui/material/Box";
import Link from "@mui/material/Link"
import { Sponsor } from "types";

export default function SponsorItem({ name, image, url }: Sponsor) {
  return (
    <Link href={url} target="_blank">
      <Box alt={name} component="img" src={image} sx={{ height: 60 }}></Box>
    </Link>
  );
}
