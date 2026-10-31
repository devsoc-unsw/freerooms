"use client";

import Faq from "@frontend/components/landing/Faq";
import Features from "@frontend/components/landing/Features";
import TextAnimation from "@frontend/components/landing/TextAnimation";
import transientOptions from "@frontend/utils/transientOptions";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import React, { useState } from "react";

import Hero from "./Hero";
import HeroBranding from "./HeroBranding";

interface LandingProps {
  heroImageSrc: string;
}

export default function Landing({ heroImageSrc }: LandingProps) {
  return (
    <LandingRoot>
      {/* Hero */}
      <LandingSection aria-label="Find a room">
        <Hero imageSrc={heroImageSrc}>
          <HeroBranding />
        </Hero>
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
}

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