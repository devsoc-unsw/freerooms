"use client";

import Faq from "@frontend/components/landing/Faq";
import Features from "@frontend/components/landing/Features";
import TextAnimation from "@frontend/components/landing/TextAnimation";
import transientOptions from "@frontend/utils/transientOptions";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import React, { useState } from "react";

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
    <LandingRoot>
      {/* Hero */}
      <LandingSection aria-label="Find a room">
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
      </LandingSection>

      {/* Features */}
      <LandingSection aria-label="Features">
        <LandingScreenContainer>
          <Features />
        </LandingScreenContainer>
      </LandingSection>

      {/* FAQ */}
      <LandingSection aria-label="Frequently asked questions">
        <Faq />
      </LandingSection>
    </LandingRoot>
  );
};

const LandingRoot = styled(Stack)(({ theme }) => ({
  width: "100%",
  maxWidth: 1440,
  boxSizing: "border-box",
  marginInline: "auto",
  padding: theme.space.xxl,
  alignItems: "center",

  [theme.breakpoints.down("sm")]: {
    padding: theme.space.md,
  },
}));

const LandingSection = styled("section")(() => ({
  width: "100%",
  minWidth: 0,
}));

const LandingScreenContainer = styled(Stack)(() => ({
  height: "100%",
  width: "80%",
  margin: "auto",
}));

interface StyledImageProps {
  $isalternate: boolean;
}

const StyledImage = styled(
  Image,
  transientOptions
)<StyledImageProps>(({ theme, $isalternate }) => ({
  height: "100%",
  width: "100%",
  display: $isalternate ? "block" : "none",
  [theme.breakpoints.down("md")]: {
    display: $isalternate ? "none" : "block",
  },
}));

const HeroPanelContainer = styled(Stack)(() => ({
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

const AnimationContainer = styled(Stack)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
  width: "80%",
  margin: "auto",
}));

export default Landing;
