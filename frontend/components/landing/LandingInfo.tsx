import { styled } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";

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
                    Find a free room and various bookings on UNSW campus.
                    While we try our best to be accurate, note that we are not
                    an official UNSW site.
                </Description>

                <Copyright>
                    © UNSW Software Development Society 2026
                </Copyright>
            </InfoColumn>

            <InfoColumn>
                <InfoGroup>
                    <InfoHeading>
                        Found a bug or want to suggest a feature?
                    </InfoHeading>

                    <Description>
                        You can do so{" "}
                        <InfoLink href="https://forms.gle/jMzhQXXfyQiBGjQaA">
                            here
                        </InfoLink>
                    </Description>
                </InfoGroup>

                <InfoGroup>
                    <InfoHeading>Got a question?</InfoHeading>

                    <Description>
                        Check the <InfoLink href="#landing-faq">FAQ</InfoLink> on
                        our landing page, or contact us through our socials.
                    </Description>
                </InfoGroup>
            </InfoColumn>

            <InfoColumn>
                <InfoGroup>
                    <InfoHeading>Contact us</InfoHeading>
                    {/* Add social links */}
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
    witdth: "100%",
    boxSizing: "border-box",
    padding: theme.space.lg,
    backgroundColor: theme.colours.accent.primary,
    color: theme.colours.neutral.black,

    [theme.breakpoints.down("md")]: {
        gridTemplateColumns: "1fr"
    },
}));

const InfoColumn = styled("div")(({theme}) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.space.lg,
    minWidth: 0,
    justifyContent: "space-between"
}));

const InfoGroup = styled("div")(({theme}) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.space.sm,
}));

const Brand = styled("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: theme.space.sm
}));

const BrandName = styled("span")(() => ({
    fontSize: 16,
    fontWeight: 500,
}));

const InfoHeading = styled("h3")(() => ({
    margin: 0,
    fontSize: 18,
    fontWeight: 500,
}));

const Description = styled("p")(() => ({
    margin: 0,
    fontSize: 14,
    lineHeight: 1.4,
}));

const Copyright = styled("p")(() => ({
    margin: 0,
    fontSize: 14,
}));

const InfoLink = styled(Link)(({theme}) => ({
    color: "inherit",
    overflowWrap: "anywhere",
    textDecoration: "underline",

    "&:focus-visible": {
        outline: `2px solid ${theme.colours.neutral.black}`,
        outlineOffset: 2,
    },
}));