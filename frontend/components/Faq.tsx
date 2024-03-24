import Link from "@mui/material/Link";
import { styled } from "@mui/system";
import Image from "next/image";
import React from "react";

import AccordionItem from "./AccordionItem";

const Faq = () => {
  return (
    <StyledParentDiv>
      <StyledHeaderDiv>
        <StyledHeading>Frequently Asked Questions</StyledHeading>
        <Image
          alt={"Underline Vector"}
          src="/assets/landing_page/underline_vector.png"
          height={12}
          width={247}
          style={{
            alignSelf: "center",
          }}
        />
      </StyledHeaderDiv>

      <StyledAccordionParent>
        <StyledAccordionContainer>
          <AccordionItem
            title="Can I book a room using Freerooms?"
            content={
              <>
                Unfortunately, as a student society we aren&apos;t able to make
                bookings for rooms.
                <br />
                <br />
                Use the &apos;Make a Booking&apos; button on the individual room
                pages to be redirected to the appropriate portals or contacts
                for bookings.
              </>
            }
          />
          <AccordionItem
            title="Why isn't my booking showing up?"
            content={
              <>
                Our data is updated periodically, so please be patient. Library
                bookings are updated every 15 minutes, all other bookings are
                updated once a week.
              </>
            }
          />
          <AccordionItem
            title="How can I get involved?"
            content={
              <>
                Freerooms is built and maintained by the UNSW Software
                Development Society (DevSoc).
                <br />
                <br />
                If you&apos;re looking to join the team, or make open source
                contributions, please visit{" "}
                <Link href="https://devsoc.app/get-involved">
                  our website
                </Link>{" "}
                for more information.
              </>
            }
          />
        </StyledAccordionContainer>
        <StyledAccordionContainer>
          <AccordionItem
            title="What happens if somebody is in a free room?"
            content={
              <>
                While Freerooms can tell you anything you want to know about
                when a room is booked, there isn&apos;t much we can do if a
                person decides to take an unbooked room.
                <br />
                <br />
                To make sure <i>you</i> are this person, keep an eye out for
                rooms marked &apos;Available Soon&apos; and get in there before
                anyone else can!
              </>
            }
          />
          <AccordionItem
            title="Why are some rooms not on Freerooms?"
            content={
              <>
                Freerooms currently only displays rooms managed by the UNSW
                Timetabling team, and library rooms.
                <br />
                <br />
                Other rooms (such as those booked through Outlook) are not yet
                supported, but we&apos;re actively exploring ways to integrate
                additional data sources, so stay tuned for future updates!
              </>
            }
          />
          <AccordionItem
            title="Is there a mobile version of Freerooms?"
            content={
              <>
                The team have put their all into creating a responsive web app
                for seamless desktop and mobile experiences. <br />
                <br />
                But that&apos;s not all — as a first for DevSoc, we are
                currently in the active development phase of an exciting new
                mobile app for Freerooms. Stay tuned for future updates!
              </>
            }
          />
        </StyledAccordionContainer>
      </StyledAccordionParent>
    </StyledParentDiv>
  );
};

export default Faq;

const StyledAccordionParent = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  width: "75%",
  [theme.breakpoints.down("lg")]: {
    flexDirection: "column",
  },
}));

const StyledAccordionContainer = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "0 1rem",
  width: "100%",
}));

const StyledHeading = styled("h2")(({ theme }) => ({
  textAlign: "center",
  fontSize: "3rem",
  marginBottom: "0rem",
  [theme.breakpoints.down("md")]: {
    marginTop: "0rem",
  },
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
