import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import React, { useState } from "react";

import transientOptions from "../utils/transientOptions";
import Faq from "./Faq";
import Features from "./Features";
import Sponsors from "./Sponsors";
import TextAnimation from "./TextAnimation";

const Landing = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [gifSource, setGifSource] = useState(
    "/assets/favicon/free_rooms_logo.png"
  );

  const handleClick = () => {
    setIsClicked(!isClicked);
    setGifSource(
      isClicked
        ? "/assets/favicon/free_rooms_logo.png"
        : "/assets/favicon/free_rooms_logo_closed.png"
    );
  };

  return (
    <Stack alignItems="center">
      <AnimationContainer>
        <DoorContainer>
          <Image
            width={150}
            height={150}
            alt="Freerooms Logo"
            src={gifSource}
            onClick={handleClick}
          />
        </DoorContainer>
        <TextAnimation />
        <HeroPanelContainer>
          <StyledImage
            src="/assets/landing_page/hero_panel.svg"
            alt="hero panel"
            $isalternate
            width="1249"
            height="1067"
          />
          <StyledImage
            src={"/assets/landing_page/hero_panel_mobile.svg"}
            alt="hero panel"
            $isalternate={false}
            width="562"
            height="547"
          />
        </HeroPanelContainer>
      </AnimationContainer>
      <LandingScreenContainer>
        <Features />
      </LandingScreenContainer>
      <Faq />
      <Sponsors />
    </Stack>
  );
};

const LandingScreenContainer = styled(Stack)(({ theme }) => ({
  height: "100%",
  width: "80%",
  margin: "auto",
}));

interface StyledImageProps {
  $isalternate: boolean;
}

const StyledImage = styled(Image, transientOptions)<StyledImageProps>(
  ({ theme, $isalternate }) => ({
    height: "100%",
    width: "100%",
    display: $isalternate ? "block" : "none",
    [theme.breakpoints.down("md")]: {
      display: $isalternate ? "none" : "block",
    },
  })
);

const HeroPanelContainer = styled(Stack)(({ theme }) => ({
  height: "100%",
  width: "100%",
  marginTop: "2rem",
}));

const DoorContainer = styled(Stack)(({ theme }) => ({
  cursor: "pointer",
  marginBottom: "1rem",
  [theme.breakpoints.down("md")]: {
    marginTop: "-3rem",
  },
}));

const AnimationContainer = styled(Stack)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  width: "80%",
  margin: "auto",
}));

export default Landing;
