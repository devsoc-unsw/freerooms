import Logo from "@frontend/public/assets/favicon/free_rooms_logo.png";
import { sizes, space, typography } from "@frontend/theme";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography, { TypographyProps } from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";

const Branding = () => (
  <Link href="/">
    <Box sx={{ display: "flex", alignItems: "center", gap: space.sm }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Image width={sizes.icon.lg} src={Logo} alt="Freerooms Logo" priority />
      </Box>
      <BrandingText>Freerooms</BrandingText>
    </Box>
  </Link>
);

const BrandingText = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.colours.accent.primary,
  fontWeight: typography.brand.fontWeight,
  fontFamily: theme.typography.fontFamily,
  fontSize: typography.brand.fontSize,
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

export default Branding;
