import { typography } from "@frontend/theme";
import { styled } from "@mui/material/styles";
import { borderColor, display, flex, fontSize, height, outline, padding, width } from "@mui/system";
import Link from "next/link";
import { text } from "node:stream/consumers";
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
  borderRadius: theme.radius.lg,

  "&hover: article": {
    borderColor: theme.colours.accent.primary,
  },

  "&:focus-visibility": {
    outline: `3px solid ${theme.colours.accent.primary}`,
    outlineOffset: 3,
  }
}));


const CardSurface = styled("article")(({theme}) => ({
  display: "flex",
  flexDirection: "column",
  weight: "100%",
  height: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  padding: theme.space.lg,
  border: `1px solid ${theme.colours.accent.secondary}`,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.colours.surface.paper,
  transition: theme.transitions.create("border-color"),

  [theme.breakpoints.down("sm")]: {
    padding: theme.space.md,
  },
}));

const CardHeading = styled("div")(({theme}) => ({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.space.sm,
}));

const CardIcon = styled("span")(({theme}) => ({
  display: "inline-flex",
  alignItems: "center",
  flexWrap: "wrap",
  color: theme.colours.text.primary,

  "& svg": {
    width: theme.sizes.control.md,
    height: theme.sizes.control.md,
  },

  [theme.breakpoints.down("sm")]: {
    "& svg": {
      width: theme.sizes.icon.lg,
      height: theme.sizes.icon.lg,
    },
  },  
}));


const CardTitle = styled("h3")(({theme}) => ({
  ...typography.cardTitle,
  margin: 0,
  color: theme.colours.text.primary,
  lineHeight: 1.2
}));

const CardStatus = styled("span")(({theme}) => ({
  color: theme.colours.accent.primary,
  fontSize: 18,
  fontWeight: theme.typography.fontWeightRegular,
  whiteSpace: "nowrap",

  [theme.breakpoints.down("sm")]: {
    fontSize: 12
  }
}));


const CardDescription = styled("p")(({theme}) => ({
  margin: 0,
  color: theme.colours.text.primary,
  fontSize: 16,
  lineHeight: 1.4,

  [theme.breakpoints.down("sm")]: {
    fontSize: 14
  }
}));