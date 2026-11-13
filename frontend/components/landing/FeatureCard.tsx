import { styled } from "@mui/material/styles";
import { display, height } from "@mui/system";
import Link from "next/link";
import React, { ReactNode } from "react";

interface FeatureCardProps {
  icon: React.ReactElement;
  heading: string;
  description: string;
  link?: string;
  status?: string,
  children?: ReactNode;
}


export default function FeatureCard({
  icon,
  heading,
  description,
  link,
  status,
  children,
}: FeatureCardProps)  {
  const content = (
    <CardSurface>
      <CardHeading>
        <CardIcon aria-hidden="true">{icon}</CardIcon>
        <CardTitle>{heading}</CardTitle>
        {status && <CardStatus>{status}</CardStatus>}
      </CardHeading>

      <CardDescription>{description}</CardDescription>

      {children}
    </CardSurface>
  );

  return link ? <CardLink href={link}>{content}</CardLink> : content;
};

const CardLink = styled(Link)(({theme}) => ({
  display: "block",
  height: "100%",
  color: "inherit",
  textDecoration: "none",
  
}));