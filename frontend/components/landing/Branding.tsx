import Logo from "@frontend/public/assets/favicon/free_rooms_logo.png";
import { sizes, space, typography } from "@frontend/theme";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography, { TypographyProps } from "@mui/material/Typography";
import Image from "next/image";

const Branding = ({ textColor }: { textColor?: string }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: space.sm }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Image width={sizes.icon.lg} src={Logo} alt="Freerooms Logo" priority />
      </Box>
      <BrandingText textColor={textColor}>Freerooms</BrandingText>
    </Box>
);

const BrandingText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "textColor",
})<{ textColor?: string }>(({ theme, textColor }) => ({
    color: textColor ?? theme.colours.accent.primary,
    fontWeight: typography.brand.fontWeight,
    fontFamily: theme.typography.fontFamily,
    fontSize: typography.brand.fontSize,
    [theme.breakpoints.down("lg")]: {
      display: "none",
    },
  }));

export default Branding;
