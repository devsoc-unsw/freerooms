import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import React, { useState } from "react";

import Logo from "../public/assets/favicon/free_rooms_logo.png";
import ClosedLogo from "../public/assets/favicon/free_rooms_logo_closed.png";
import Faq from "./Faq";
import Features from "./Features";
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
          />
        </DoorContainer>
        <TextAnimation />
        <HeroPanelContainer>
          <StyledImage
            src="/assets/landing_page/hero_panel.svg"
            alt="hero panel"
            isAlternate
            width="1249"
            height="1067"
          />
          <StyledImage
            src={"/assets/landing_page/hero_panel_mobile.svg"}
            alt="hero panel"
            isAlternate={false}
            width="562"
            height="547"
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
