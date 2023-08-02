import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import MapIcon from "@mui/icons-material/Map";
import { styled } from "@mui/system";
import Image from "next/image";
import React from "react";

import background from "../public/assets/landing_page/usage_background.png";
import vector from "../public/assets/landing_page/usage_tips_vector.png";
import UsageCard from "./UsageCard";

const UsageTips = () => {
  return (
    <StyledUsageDiv>
      <StyledBackgroudVector src={background} alt="background vector" />
      <StyledUsageVector alt={"Usage Vector"} src={vector} />
      <StyledHeading style={{}}>Usage Tips</StyledHeading>
      <StyledCardParent>
        <UsageCard
          icon={
            <EventAvailableIcon style={{ height: "3rem", width: "3rem" }} />
          }
          heading="Timetable"
          description="Check the timetable to see available rooms at UNSW and avoid scheduling conflicts."
        />
        <UsageCard
          icon={<MapIcon style={{ height: "3rem", width: "3rem" }} />}
          heading="Timetable"
          description="Check the timetable to see available rooms at UNSW and avoid scheduling conflicts."
        />
        <UsageCard
          icon={
            <EventAvailableIcon style={{ height: "3rem", width: "3rem" }} />
          }
          heading="Timetable"
          description="Check the timetable to see available rooms at UNSW and avoid scheduling conflicts."
        />
      </StyledCardParent>
    </StyledUsageDiv>
  );
};

export default UsageTips;

const StyledHeading = styled("h2")(({ theme }) => ({
  textAlign: "center",
  fontSize: "3rem",
  marginBottom: "5rem",
}));

const StyledUsageVector = styled(Image)(({ theme }) => ({
  marginBottom: "-3rem",
  marginLeft: "-18rem",
}));

const StyledUsageDiv = styled("div")(({ theme }) => ({
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
