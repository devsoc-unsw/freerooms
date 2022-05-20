import Image from "next/image";
import Logo from "../public/assets/favicon/free_rooms_logo.png";
import Box, { BoxProps } from "@mui/material/Box";
import { styled, SxProps, Theme } from "@mui/material/styles";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { orange } from "@mui/material/colors";

const StyledText = styled(Typography)<TypographyProps>(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 500,
}));

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flex: 1,
}));

const Branding = (props: BoxProps) => (
  <StyledBox {...props}>
    <div style={{ width: 50, marginLeft: 10, marginRight: 5 }}>
      <Image src={Logo} alt="Freerooms Logo" priority />
    </div>
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <StyledText sx={{ lineHeight: 1 }}>Freerooms</StyledText>
      <StyledText sx={{ lineHeight: 1, marginTop: 0.5 }}>22T1</StyledText>
    </Box>
  </StyledBox>
);

export default Branding;
