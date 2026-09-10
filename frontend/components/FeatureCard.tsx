import { styled } from "@mui/material/styles";
import Link from "next/link";
import React from "react";

interface FeatureCardProps {
  icon: React.ReactElement;
  heading: string;
  description: string;
  link?: string;
  onClick?: () => void;
}

const StyledParentDiv = styled("div")(({ theme }) => ({
  backgroundColor: theme.colours.surface.paper,
  padding: "1rem",
  borderRadius: "15px",
  boxShadow: theme.shadows[4],
  height: "20rem",
  width: "19rem",
  transition: "transform 0.3s",
  cursor: "pointer",
  margin: "1rem 0.5rem",
  [theme.breakpoints.down("lg")]: {
    boxShadow: theme.shadows[4],
  },
}));

const StyledIconDiv = styled("div")(({ theme }) => ({
  marginTop: "2rem",
}));

const StyledHeading = styled("h2")(({ theme }) => ({
  marginTop: "0rem",
  fontSize: "2rem",
}));

const StyledLine = styled("h2")(({ theme }) => ({
  height: "0.5rem",
  width: "10rem",
  backgroundColor: theme.colours.accent.primary,
  borderRadius: "2rem",
  marginTop: "-1rem",
}));

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  heading,
  description,
  link,
  onClick,
}) => {
  return (
    <Link href={link ?? "#"} onClick={onClick}>
      <StyledParentDiv
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <StyledIconDiv>{icon}</StyledIconDiv>
        <StyledHeading>{heading}</StyledHeading>
        <StyledLine />
        <p>{description}</p>
      </StyledParentDiv>
    </Link>
  );
};

export default FeatureCard;
