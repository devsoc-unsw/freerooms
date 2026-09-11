import Box, { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography, { TypographyProps } from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import { sizes, space, typography } from "@frontend/theme";

import Logo from "@frontend/public/assets/favicon/free_rooms_logo.png";

const LogoText = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.colours.accent.primary,
  fontWeight: typography.brand.fontWeight,
  fontFamily: theme.typography.fontFamily,
  fontSize: typography.brand.fontSize,
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const LogoBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: space.sm,
  flex: 1,
  "&:hover": {
    cursor: "pointer",
  },
}));

const LogoImageContainer = styled('div')({
  display: "flex",
  alignItems: "center"
})

const Branding = (props: BoxProps) => (
  <Link href="/">
    <LogoBox {...props}>
      <LogoImageContainer>
        <Image width={sizes.icon.lg} src={Logo} alt="Freerooms Logo" priority />
      </LogoImageContainer>
      <LogoText>Freerooms</LogoText>
    </LogoBox>
  </Link>
);

export default Branding;
