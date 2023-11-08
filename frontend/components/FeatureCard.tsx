import { styled } from "@mui/system";
import Link from "next/link";
import React from "react";

interface FeatureCardProps {
  icon: React.ReactElement;
  heading: string;
  description: string;
  link: string;
}

const StyledParentDiv = styled("div")(({ theme }) => ({
  backgroundColor: "white",
  padding: "1rem",
  borderRadius: "15px",
  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
  height: "20rem",
  width: "20rem",
  transition: "transform 0.3s",
  cursor: "pointer",
  margin: "1rem 0",
  [theme.breakpoints.down("lg")]: {
    boxShadow:
      "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
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
  backgroundColor: "#FF5C18",
  borderRadius: "2rem",
  marginTop: "-1rem",
}));

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  heading,
  description,
  link,
}) => {
  return (
    <Link href={link}>
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
