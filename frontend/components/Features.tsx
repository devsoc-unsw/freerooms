import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GridIcon from "@mui/icons-material/GridViewRounded";
import MapIcon from "@mui/icons-material/Map";
import { styled } from "@mui/system";
import Image from "next/image";
import React from "react";

import background from "../public/assets/landing_page/Feature_background.png";
import vector from "../public/assets/landing_page/Feature_vector.png";
import FeatureCard from "./FeatureCard";

const Features = () => {
  return (
    <StyledFeatureDiv>
      <StyledBackgroudVector src={background} alt="background vector" />
      <StyledFeatureVector alt={"Feature Vector"} src={vector} />
      <StyledHeading style={{}}>Our Features</StyledHeading>
      <StyledCardParent>
        <FeatureCard
          icon={<GridIcon style={{ height: "3rem", width: "3rem" }} />}
          heading="Browse Buildings"
          description="Check the timetable to see available rooms at UNSW and avoid scheduling conflicts."
          link="/browse"
        />
        <FeatureCard
          icon={<MapIcon style={{ height: "3rem", width: "3rem" }} />}
          heading="Map"
          description="Check the timetable to see available rooms at UNSW and avoid scheduling conflicts."
          link="/map"
        />
        <FeatureCard
          icon={
            <EventAvailableIcon style={{ height: "3rem", width: "3rem" }} />
          }
          heading="Timetable"
          description="Check the timetable to see available rooms at UNSW and avoid scheduling conflicts."
          link="/timetable"
        />
      </StyledCardParent>
    </StyledFeatureDiv>
  );
};

export default Features;

const StyledHeading = styled("h2")(({ theme }) => ({
  textAlign: "center",
  fontSize: "3rem",
  marginBottom: "5rem",
}));

const StyledFeatureVector = styled(Image)(({ theme }) => ({
  marginBottom: "-4rem",
  marginLeft: "-19rem",
}));

const StyledFeatureDiv = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "center",
  position: "relative",
  padding: "5rem 0",
}));

const StyledBackgroudVector = styled(Image)(({ theme }) => ({
  position: "absolute",
  bottom: "-3rem",
  zIndex: "-1",
  width: "90%",
  height: "auto",
  [theme.breakpoints.down("lg")]: {
    display: "none",
  },
}));

const StyledCardParent = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  width: "90%",
  justifyContent: "space-evenly",
  [theme.breakpoints.down("lg")]: {
    flexDirection: "column",
    alignItems: "center",
  },
}));
