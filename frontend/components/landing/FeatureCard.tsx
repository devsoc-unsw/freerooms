import { typography } from "@frontend/theme";
import { styled } from "@mui/material/styles";
import Link from "next/link";
import React, { ReactNode } from "react";

interface FeatureCardProps {
  icon: React.ReactElement;
  heading: string;
  description: string;
  link?: string;
  status?: string;
  previewPosition?: "side" | "below";
  children?: ReactNode;
}

export default function FeatureCard({
  icon,
  heading,
  description,
  link,
  status,
  previewPosition = "below",
  children,
}: FeatureCardProps) {
  const content = (
    <CardSurface $sidePreview={previewPosition === "side"}>
      <CardText className="feature-card-text">
        <CardHeading>
          <CardIcon aria-hidden="true">{icon}</CardIcon>
          <CardTitle>{heading}</CardTitle>
          {status && <CardStatus>{status}</CardStatus>}
        </CardHeading>

        <CardDescription>{description}</CardDescription>
      </CardText>

      {children && <CardPreview>{children}</CardPreview>}
    </CardSurface>
  );

  return link ? <CardLink href={link}>{content}</CardLink> : content;
}

const CardLink = styled(Link)(({ theme }) => ({
  display: "block",
  height: "100%",
  color: "inherit",
  textDecoration: "none",
  borderRadius: theme.radius.lg,

  "&:hover article": {
    borderColor: theme.colours.accent.primary,
  },

  "&:focus-visible": {
    outline: `3px solid ${theme.colours.accent.primary}`,
    outlineOffset: 3,
  },
}));

const CardSurface = styled("article", {
  shouldForwardProp: (prop) => prop !== "$sidePreview",
})<{ $sidePreview: boolean }>(({ theme, $sidePreview }) => ({
  display: "flex",
  flexDirection: $sidePreview ? "row" : "column",
  gap: theme.space.md,
  width: "100%",
  height: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  padding: theme.space.lg,
  border: `1px solid ${theme.colours.accent.secondary}`,
  borderRadius: theme.radius.lg,
  backgroundColor: theme.colours.surface.paper,
  transition: theme.transitions.create("border-color"),

  "& > .feature-card-text": {
    width: $sidePreview ? "35%" : "100%",
  },

  [theme.breakpoints.down("md")]: {
    flexDirection: "column",

    "& > .feature-card-text": {
      width: "100%",
    },
  },

  [theme.breakpoints.down("sm")]: {
    padding: theme.space.md,
  },
}));

const CardText = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.space.md,
}));

const CardPreview = styled("div")(() => ({
  display: "flex",
  flex: 1,
  minWidth: 0,
  minHeight: 0,
}));

const CardHeading = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.space.sm,
}));

const CardIcon = styled("span")(({ theme }) => ({
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

const CardTitle = styled("h3")(({ theme }) => ({
  ...typography.cardTitle,
  margin: 0,
  color: theme.colours.text.primary,
  lineHeight: 1.2,
}));

const CardStatus = styled("span")(({ theme }) => ({
  color: theme.colours.accent.primary,
  fontSize: 18,
  fontWeight: theme.typography.fontWeightRegular,
  whiteSpace: "nowrap",

  [theme.breakpoints.down("sm")]: {
    fontSize: 12,
  },
}));

const CardDescription = styled("p")(({ theme }) => ({
  margin: 0,
  color: theme.colours.text.primary,
  fontSize: 16,
  lineHeight: 1.4,

  [theme.breakpoints.down("sm")]: {
    fontSize: 14,
  },
}));
