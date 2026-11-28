import AccordionItem from "@frontend/components/ui/AccordionItem";
import { typography } from "@frontend/theme/typography";
import Link from "@mui/material/Link";
import { styled } from "@mui/material/styles";

const Faq = () => {
  return (
    <StyledParentDiv>
      <StyledHeaderDiv>
        <StyledHeading id="landing-faq">FAQ</StyledHeading>
      </StyledHeaderDiv>

      <StyledAccordionParent>
        <AccordionItem
          title="Can I book a room using Freerooms?"
          content={
            <>
              Unfortunately, as a student society we aren&apos;t able to make
              bookings for rooms.
              <br />
              <br />
              Use the &apos;Make a Booking&apos; button on the individual room
              pages to be redirected to the appropriate portals or contacts for
              bookings.
            </>
          }
        />
        <AccordionItem
          title="What happens if somebody is in a free room?"
          content={
            <>
              While Freerooms can tell you anything you want to know about when
              a room is booked, there isn&apos;t much we can do if a person
              decides to take an unbooked room.
              <br />
              <br />
              To make sure <i>you</i> are this person, keep an eye out for rooms
              marked &apos;Available Soon&apos; and get in there before anyone
              else can!
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
          title="How can I get involved?"
          content={
            <>
              Freerooms is built and maintained by the UNSW Software Development
              Society (DevSoc).
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
        <AccordionItem
          title="Is there a mobile version of Freerooms?"
          content={
            <>
              The team have put their all into creating a responsive web app for
              seamless desktop and mobile experiences. <br />
              <br />
              But that&apos;s not all — as a first for DevSoc, we are currently
              in the active development phase of an exciting new mobile app for
              Freerooms. Stay tuned for future updates!
            </>
          }
        />
      </StyledAccordionParent>
    </StyledParentDiv>
  );
};

export default Faq;

const StyledAccordionParent = styled("div")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: theme.space.md,
  width: "100%",
  alignItems: "start",

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "minmax(0, 1fr)",
  },
}));

const StyledHeading = styled("h2")(({ theme }) => ({
  ...typography.sectionHeading,
  margin: 0,
  color: theme.colours.accent.primary,
  fontSize: "clamp(48px, 15vw, 64px)",
  lineHeight: 1.15,
  textAlign: "center",
}));

const StyledHeaderDiv = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginBottom: theme.space.lg,
}));

const StyledParentDiv = styled("div")(({ theme }) => ({
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  width: "100%",
  paddingBlock: theme.space.xl,
}));
