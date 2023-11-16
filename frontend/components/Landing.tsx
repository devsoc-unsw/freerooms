import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import React, { useState } from "react";

import Logo from "../public/assets/favicon/free_rooms_logo.png";
import ClosedLogo from "../public/assets/favicon/free_rooms_logo_closed.png";
import HeroPanel from "../public/assets/landing_page/hero_panel.svg";
import MobileHeroPanel from "../public/assets/landing_page/hero_panel_mobile.svg";
import Faq from "./Faq";
import Features from "./Features";
import TextAnimation from "./TextAnimation";

const Landing = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [gifSource, setGifSource] = useState(Logo);

  const handleClick = () => {
    setIsClicked(!isClicked);
    setGifSource(isClicked ? Logo : ClosedLogo);
  };
  // TODO: less line spacing, more space between title and image
  // TODO: Add mobile version of landing page should have mobile images
  return (
    <div>
      <AnimationContainer>
        <DoorContainer>
          <Image
            width={150}
            height={150}
            alt="Freerooms Logo"
            src={gifSource}
            onClick={handleClick}
            style={{}}
          />
        </DoorContainer>
        <TextAnimation />
        <HeroPanelContainer>
          <StyledImage src={HeroPanel} alt="hero panel" isAlternate />
          <StyledImage
            src={MobileHeroPanel}
            alt="hero panel"
            isAlternate={false}
          />
        </HeroPanelContainer>
      </AnimationContainer>
      <LandingScreenContainer>
        <Features />
      </LandingScreenContainer>
      <Faq />
    </div>
  );
};

const LandingScreenContainer = styled(Stack)(({ theme }) => ({
  height: "100%",
  width: "80%",
  margin: "auto",
}));

interface StyledImageProps {
  isAlternate: boolean;
}

const StyledImage = styled(Image)<StyledImageProps>(
  ({ theme, isAlternate }) => ({
    height: "100%",
    width: "100%",
    display: isAlternate ? "block" : "none",
    [theme.breakpoints.down("md")]: {
      display: isAlternate ? "none" : "block",
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
