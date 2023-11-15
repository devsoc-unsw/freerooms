import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GridIcon from "@mui/icons-material/GridViewRounded";
import MapIcon from "@mui/icons-material/Map";
import { styled } from "@mui/system";
import Image from "next/image";
import React from "react";

import background from "../public/assets/landing_page/Feature_background.png";
import vector from "../public/assets/landing_page/Feature_vector.png";
import { useDispatch } from "../redux/hooks";
import { openSearch } from "../redux/searchOpenSlice";
import FeatureCard from "./FeatureCard";

const Features = () => {
  const dispatch = useDispatch();
  return (
    <StyledFeatureDiv>
      <StyledBackgroudVector src={background} alt="background vector" />
      <StyledFeatureVector alt={"Feature Vector"} src={vector} />
      <StyledHeading>Our Features</StyledHeading>
      <StyledCardParent>
        <FeatureCard
          icon={<GridIcon style={{ height: "3rem", width: "3rem" }} />}
          heading="Browse Buildings"
          description="Efficiently browse a complete list of available rooms and buildings, with customizable filters for quick and easy scheduling."
          link="/browse"
        />
        <FeatureCard
          icon={<MapIcon style={{ height: "3rem", width: "3rem" }} />}
          heading="Map"
          description="Explore a dynamic map showcasing building availability near your location, and quickly find the perfect spot for your next study session."
          link="/map"
        />
        <FeatureCard
          icon={
            <EventAvailableIcon style={{ height: "3rem", width: "3rem" }} />
          }
          heading="Timetable"
          description="Get instant access to real-time room schedules across campus, ensuring you're always in the right place at the right time."
          onClick={() => dispatch(openSearch())}
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
