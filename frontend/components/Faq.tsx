import { styled } from "@mui/system";
import Image from "next/image";
import React, { useState } from "react";

import underline from "../public/assets/landing_page/underline_vector.png";
import AccordionItem from "./AccordionItem";

// TODO: Change descriptions and titles of faqs

const Faq = () => {
  return (
    <StyledParentDiv>
      <StyledHeaderDiv>
        <StyledHeading>Frequently Asked Questions</StyledHeading>
        <Image
          alt={"Underline Vector"}
          src={underline}
          style={{
            alignSelf: "end",
          }}
        />
      </StyledHeaderDiv>

      <StyledAccordionParent>
        <AccordionItem
          title="What is this?"
          description="Include a dedicated section where users can easily submit their feedback, suggestions, or issue reports. This feature enables users to provide feedback directly within the software, enhancing user engagement and facilitating continuous improvement."
        />
        <AccordionItem
          title="What is this?"
          description="Include a dedicated section where users can easily submit their feedback, suggestions, or issue reports. This feature enables users to provide feedback directly within the software, enhancing user engagement and facilitating continuous improvement."
        />
        <AccordionItem
          title="What is this?"
          description="Include a dedicated section where users can easily submit their feedback, suggestions, or issue reports. This feature enables users to provide feedback directly within the software, enhancing user engagement and facilitating continuous improvement."
        />
        <AccordionItem
          title="What is this?"
          description="Include a dedicated section where users can easily submit their feedback, suggestions, or issue reports. This feature enables users to provide feedback directly within the software, enhancing user engagement and facilitating continuous improvement."
        />
        <AccordionItem
          title="What is this?"
          description="Include a dedicated section where users can easily submit their feedback, suggestions, or issue reports. This feature enables users to provide feedback directly within the software, enhancing user engagement and facilitating continuous improvement."
        />
        <AccordionItem
          title="What is this?"
          description="Include a dedicated section where users can easily submit their feedback, suggestions, or issue reports. This feature enables users to provide feedback directly within the software, enhancing user engagement and facilitating continuous improvement."
        />
      </StyledAccordionParent>
    </StyledParentDiv>
  );
};

export default Faq;

const StyledAccordionParent = styled("div")(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  alignContent: "center",
  width: "75%",
  [theme.breakpoints.down("lg")]: {
    flexDirection: "column",
  },
}));

const StyledHeading = styled("h2")(({ theme }) => ({
  textAlign: "center",
  fontSize: "3rem",
  marginBottom: "0rem",
  marginTop: "10rem",
}));

const StyledHeaderDiv = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginBottom: "3rem",
}));

const StyledParentDiv = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  width: "100%",
  alignItems: "center",
}));
