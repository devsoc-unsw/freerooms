"use client";

import Faq from "@frontend/components/landing/Faq";
import Features from "@frontend/components/landing/Features";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

import Hero from "./Hero";
import HeroBranding from "./HeroBranding";
import LandingInfo from "./LandingInfo";

interface LandingProps {
  heroImageSrc: string;
}

export default function Landing({ heroImageSrc }: LandingProps) {
  return (
    <>
      <LandingRoot>
        {/* Hero */}
        <LandingSection aria-label="Find a room">
          <Hero imageSrc={heroImageSrc}>
            <HeroBranding />
          </Hero>
        </LandingSection>

        {/* Features */}
        <LandingSection aria-label="Features">
          <Features />
        </LandingSection>

        {/* FAQ */}
        <LandingSection aria-label="Frequently asked questions">
          <Faq />
        </LandingSection>
      </LandingRoot>

      {/* Landing information */}
      <LandingInfo />
    </>
  );
}

const LandingRoot = styled(Stack)(({ theme }) => ({
  width: "100%",
  boxSizing: "border-box",
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
