import Box, { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography, { TypographyProps } from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";

import Logo from "../public/assets/favicon/free_rooms_logo.png";

const StyledText = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontFamily: "Josefin Sans",
  fontSize: "2rem",
  [theme.breakpoints.down("sm")]: {
    display: "none",
  },
}));

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flex: 1,
  opacity: 1,
  transition: "all 0.1s ease-in-out",
  "&:hover": {
    cursor: "pointer",
    opacity: 0.7,
  },
}));

const Branding = (props: BoxProps) => (
  <Link href="/">
    <StyledBox {...props}>
      <div>
        <Image width={50} src={Logo} alt="Freerooms Logo" priority />
      </div>
      <StyledText sx={{ lineHeight: 1 }}>Freerooms</StyledText>
    </StyledBox>
  </Link>
);

export default Branding;
