import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import MapIcon from '@mui/icons-material/Map';
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import Button from "../components/Button";
import parentLogo from "../public/assets/favicon/csesocgreyblue.png";
import Logo from "../public/assets/favicon/free_rooms_logo.png";

const Landing = () => {
  return (
    <LandingScreenContainer direction="row" justifyContent="center">
      <Stack direction="column" spacing={2} sx={{ margin: "auto" }}>
        <Stack style={{ width: "auto" }}>
          <Image alt={"CSESOC Logo"} width={110} height={25} src={parentLogo} />
        </Stack>
        <GradientText
          variant="h1"
          fontFamily="Josefin Sans, sans-serif"
          fontSize={{ xs: "4rem", md: "5rem" }}
        >
          Freerooms
        </GradientText>
        <GradientText fontSize={{ xs: "1rem", md: "1.5rem" }}>
          UNSW room bookings
        </GradientText>
        <Stack direction="column" spacing={2}>
          <LandingButton LinkComponent={Link} href="/browse" sx={{ width: "13rem" }} endIcon={<GridViewRoundedIcon/>}>
            <Typography fontWeight="bold" sx={{display: "flex", margin: "auto"}}>Browse</Typography>
          </LandingButton>
          <LandingButton LinkComponent={Link} href="/map" sx={{ width: "13rem" }} endIcon={<MapIcon/>}>
            <Typography fontWeight="bold" sx={{display: "flex", margin: "auto"}}>Map</Typography>
          </LandingButton>
        </Stack>
      </Stack>
      <Box margin="auto" display={{ xs: "none", md: "block" }} >
        <Image width={400} height={400} alt={"Freerooms Logo"} src={Logo} />
      </Box>
    </LandingScreenContainer>
  );
};

const GradientText = styled(Typography)({
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundImage: "linear-gradient(to left, #d26038, #f5915a)",
  animation: "gradient 10s ease infinite",
  backgroundSize: "400% 400%",
  fontWeight: 700,
  "@keyframes gradient": {
    "0%": {
      backgroundPosition: "0% 50%"
    },
    "50%": {
      backgroundPosition: "100% 50%"
    },
    "100%": {
      backgroundPosition: "0% 50%"
    }
  }
})

const LandingScreenContainer = styled(Stack)(({ theme }) => ({
  height: "100%",
  width: "80%",
  margin: "auto"
}))

const LandingButton = styled(Button)(({ theme }) => ({
  mx: theme.spacing(1),
  justifyContent: "space-between",
  padding: theme.spacing(1.5, 7)
}))

export default Landing;