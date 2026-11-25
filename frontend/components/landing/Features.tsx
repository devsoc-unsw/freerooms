import FeatureCard from "@frontend/components/landing/FeatureCard";
import { typography } from "@frontend/theme";
import FavouriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { styled } from "@mui/material/styles";

import BuildingPreview from "./BuildingPreview";
import MapPreview from "./MapPreview";

export default function Features() {
  return (
    <FeatureRoot aria-labelledby="features-heading">
      <SectionHeading id="features-heading">Features</SectionHeading>

      <FeatureGrid>
        <GridItem style={{ gridArea: "browse" }}>
          <FeatureCard
            icon={<SearchRoundedIcon />}
            heading="Browse Locations"
            description="Search and filter for available buildings, rooms and bookings (including classes & society events)."
            link="/browse"
            previewPosition="side"
          >
            <BuildingPreview />
          </FeatureCard>
        </GridItem>

        <GridItem style={{ gridArea: "map" }}>
          <FeatureCard
            icon={<MapOutlinedIcon />}
            heading="Map View"
            description="Dynamic maps with building availability, proximity detection and navigation."
            link="/map"
          >
            <MapPreview />
          </FeatureCard>
        </GridItem>

        <GridItem style={{ gridArea: "favourites" }}>
          <FeatureCard
            icon={<FavouriteBorderIcon />}
            heading="Favouriting"
            description="Favourite rooms and buildings and easily see when they’re available."
            link="/favourites"
          />
        </GridItem>

        <GridItem style={{ gridArea: "accounts" }}>
          <FeatureCard
            icon={<PersonOutlinedIcon />}
            heading="User Accounts"
            description="Login and sync your data across our website and mobile app."
            status="Coming soon!"
          />
        </GridItem>
      </FeatureGrid>
    </FeatureRoot>
  );
}

const FeatureRoot = styled("section")(({ theme }) => ({
  width: "100%",
  paddingBlock: theme.space.xxl,
}));

const SectionHeading = styled("h2")(({ theme }) => ({
  ...typography.sectionHeading,
  margin: 0,
  marginBottom: theme.space.lg,
  color: theme.colours.accent.primary,
  textAlign: "center",
  fontSize: "clamp(48px, 15vw, 64px)",
  lineHeight: 1.15,
}));

const FeatureGrid = styled("div")(({ theme }) => ({
  display: "grid",
  width: "100%",
  gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
  gridTemplateRows: "repeat(2, minmax(192px, auto))",
  gridTemplateAreas: `
    "browse browse map"
    "favourites accounts map"
  `,
  gap: theme.space.lg,

  [theme.breakpoints.down("md")]: {
    gridTemplateColumns: "minmax(0, 1fr)",
    gridTemplateRows: "none",
    gridTemplateAreas: `
      "browse"
      "map"
      "favourites"
      "accounts"
    `,
  },
}));

const GridItem = styled("div")(() => ({
  minWidth: 0,
  minHeight: 0,
}));
