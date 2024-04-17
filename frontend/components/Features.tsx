import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import GridIcon from "@mui/icons-material/GridViewRounded";
import MapIcon from "@mui/icons-material/Map";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import Image from "next/image";
import React from "react";

import { useDispatch } from "../redux/hooks";
import { openSearch } from "../redux/searchOpenSlice";
import FeatureCard from "./FeatureCard";

const Features = () => {
  const dispatch = useDispatch();
  return (
    <StyledFeatureDiv>
      <div>
        <StyledFeatureVector
          alt={"Feature Vector"}
          src="/assets/landing_page/feature_vector.png"
          width={36}
          height={34}
        />
        <StyledHeading>Our Features</StyledHeading>
      </div>

      <Box
        mt={10}
        width="100%"
        height={{ xs: "50rem", md: "45rem", lg: "25rem" }}
      >
        <div>
          <StyledBackgroudVector
            src="/assets/landing_page/feature_background.png"
            alt="background vector"
            width={1125} // Set the actual width of the image
            height={485} // Set the actual height of the image
          />
        </div>

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
      </Box>
    </StyledFeatureDiv>
  );
};

export default Features;

const StyledHeading = styled("h2")(({ theme }) => ({
  textAlign: "center",
  fontSize: "3rem",
  paddingBottom: "50%",
}));

const StyledFeatureVector = styled(Image)(({ theme }) => ({
  marginBottom: "-4rem",
  marginRight: "20rem",
  maxWidth: "100%",
  height: "auto",
}));

const StyledFeatureDiv = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-evenly",
  alignItems: "center",
  position: "relative",
  padding: "5rem 0",
  [theme.breakpoints.down("lg")]: {
    gap: "0rem",
  },
}));

const StyledBackgroudVector = styled(Image)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  zIndex: "-1",
  width: "100%", // Or specify a specific width
  height: "auto", // This will maintain the aspect ratio
  [theme.breakpoints.down("lg")]: {
    display: "none",
  },
}));

const StyledCardParent = styled("div")(({ theme }) => ({
  position: "absolute",
  display: "flex",
  flexDirection: "row",
  width: "90%",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  justifyContent: "space-evenly",
  [theme.breakpoints.down("lg")]: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: "25%",
    paddingBottom: "25%",
  },
  [theme.breakpoints.down("md")]: {
    marginTop: "20%",
    paddingBottom: "15%",
  },
}));
