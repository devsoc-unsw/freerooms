import { styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import {
  FaDiscord,
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa6";

const socialLinks = [
  {
    label: "Email",
    href: "mailto:contact@devsoc.app",
    icon: FaEnvelope,
  },
  {
    label: "GitHub",
    href: "https://github.com/devsoc-unsw/freerooms",
    icon: FaGithub,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/devsocUNSW/",
    icon: FaFacebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/devsoc_unsw/",
    icon: FaInstagram,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/97436660/",
    icon: FaLinkedin,
  },
  {
    label: "Discord",
    href: "https://discord.com/invite/u9p34WUTcs",
    icon: FaDiscord,
  },
] as const;

export default function LandingInfo() {
  return (
    <InfoPanel aria-label="About Freerooms">
      <InfoColumn>
        <Brand>
          <Image
            src="/assets/favicon/free_rooms_logo.png"
            alt=""
            width={24}
            height={24}
          />
          <BrandName>Freerooms</BrandName>
        </Brand>

        <Description>
          Find a free room and various bookings on UNSW campus. While we try our
          best to be accurate, note that we are not an official UNSW site.
        </Description>

        <Copyright>© UNSW Software Development Society 2026</Copyright>
      </InfoColumn>

      <InfoColumn>
        <InfoGroup>
          <InfoHeading>Found a bug or want to suggest a feature?</InfoHeading>

          <Description>
            You can do so{" "}
            <InfoLink href="https://forms.gle/jMzhQXXfyQiBGjQaA">here</InfoLink>
          </Description>
        </InfoGroup>

        <InfoGroup>
          <InfoHeading>Got a question?</InfoHeading>

          <Description>
            Check the <InfoLink href="#landing-faq">FAQ</InfoLink> on our
            landing page, or contact us through our socials.
          </Description>
        </InfoGroup>
      </InfoColumn>

      <InfoColumn>
        <InfoGroup>
          <InfoHeading>Contact us</InfoHeading>

          <SocialRow aria-label="Contact and Social media links">
            {socialLinks.map(({ label, href, icon: Icon }) => {
              const isExternal = href.startsWith("https://");

              return (
                <SocialLink
                  key={label}
                  href={href}
                  aria-label={label}
                  title={label}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  <Icon size={28} aria-hidden="true" />
                </SocialLink>
              );
            })}
          </SocialRow>
        </InfoGroup>

        <InfoGroup>
          <Description>
            Interested in webdev at UNSW? Apply to join DevSoc!
          </Description>

          <InfoLink href="https://devsoc.app/get-involved">
            https://devsoc.app/get-involved
          </InfoLink>
        </InfoGroup>
      </InfoColumn>
    </InfoPanel>
  );
}

const InfoPanel = styled("section")(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gap: theme.space.lg,
  width: "100%",
  boxSizing: "border-box",
  padding: theme.space.lg,
  backgroundColor: theme.colours.accent.primary,
  color:
    theme.palette.mode === "light"
      ? theme.colours.neutral.white
      : theme.colours.neutral.black,

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "1fr",
  },

  [theme.breakpoints.down("sm")]: {
    gap: theme.space.md,
    paddingTop: theme.space.lg,
    paddingInline: theme.space.lg + theme.space.xs,
    paddingBottom: theme.space.lg + theme.sizes.navBar.height,
  },
}));

const InfoColumn = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.space.lg,
  minWidth: 0,
  justifyContent: "space-between",

  [theme.breakpoints.down("sm")]: {
    gap: theme.space.md,
    justifyContent: "flex-start",
  },
}));

const InfoGroup = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.space.sm,
}));

const Brand = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.space.sm,
}));

const BrandName = styled("span")(({ theme }) => ({
  fontSize: 16,
  fontWeight: 500,

  [theme.breakpoints.down("sm")]: {
    fontSize: 14,
  },
}));

const InfoHeading = styled("h3")(({ theme }) => ({
  margin: 0,
  fontSize: 18,
  fontWeight: 500,

  [theme.breakpoints.down("sm")]: {
    fontSize: 13,
    fontWeight: 400,
    lineHeight: 1.3,
  },
}));

const Description = styled("p")(({ theme }) => ({
  margin: 0,
  fontSize: 14,
  lineHeight: 1.4,

  [theme.breakpoints.down("sm")]: {
    fontSize: 11,
  },
}));

const Copyright = styled("p")(({ theme }) => ({
  margin: 0,
  fontSize: 14,

  [theme.breakpoints.down("sm")]: {
    fontSize: 11,
    lineHeight: 1.4,
  },
}));

const InfoLink = styled(Link)(({ theme }) => ({
  color: "inherit",
  overflowWrap: "anywhere",
  textDecoration: "underline",

  "&:focus-visible": {
    outline: `2px solid ${theme.colours.neutral.black}`,
    outlineOffset: 2,
  },
}));

const SocialRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: theme.space.sm,
}));

const SocialLink = styled("a")(({ theme }) => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  color: "inherit",
  lineHeight: 0,

  "&:hover": {
    opacity: 0.8,
  },

  "&:focus-visible": {
    outline: `2px solid ${theme.colours.neutral.black}`,
    outlineOffset: 2,
  },

  [theme.breakpoints.down("sm")]: {
    "& svg": {
      width: theme.sizes.icon.md,
      height: theme.sizes.icon.md,
    },
  },
}));
