"use client";

import { typography } from "@frontend/theme/typography";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { styled } from "@mui/material/styles";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

export default function HeroBranding() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isClicked, setIsClicked] = useState(false);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const search = query.trim();

    router.push(search ? `/browse?q=${encodeURIComponent(search)}` : "/browse");
  };

  return (
    <BrandingRoot>
      <TitleRow>
        <LogoButton
          type="button"
          aria-label={
            isClicked ? "Open Freerooms door" : "Close Freerooms door"
          }
          aria-pressed={isClicked}
          onClick={() => setIsClicked((prev) => !prev)}
        >
          <LogoImage
            src={
              isClicked
                ? "/assets/favicon/free_rooms_logo_closed.png"
                : "/assets/favicon/free_rooms_logo.png"
            }
            alt="Freerooms Logo"
            width={150}
            height={150}
          />
        </LogoButton>

        <Wordmark>Freerooms</Wordmark>
      </TitleRow>

      <Subtitle>Find a room on UNSW campus for your needs.</Subtitle>

      <SearchForm role="search" onSubmit={handleSearch}>
        <SearchInput
          type="search"
          name="q"
          aria-label="Search for free rooms"
          placeholder="Search for free rooms..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        <SearchAction type="submit" aria-label="Search">
          <SearchRoundedIcon />
        </SearchAction>
      </SearchForm>
    </BrandingRoot>
  );
}

const BrandingRoot = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  height: "100%",
  boxSizing: "border-box",
  paddingInline: theme.space.xxl,
  paddingTop: theme.space.xxl + theme.space.md,

  [theme.breakpoints.down("sm")]: {
    paddingInline: theme.space.md,
    paddingTop: theme.space.lg,
  },
}));

const TitleRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",

  [theme.breakpoints.down("sm")]: {
    gap: theme.space.xs,
  },
}));

const LogoButton = styled("button")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  border: 0,
  background: "transparent",
  cursor: "pointer",
  flexShrink: 0,

  "&:focus-visible": {
    outline: `3px solid ${theme.colours.accent.secondary}`,
    outlineOffset: 3,
  },
}));

const LogoImage = styled(Image)(({ theme }) => ({
  display: "block",
  width: "clamp(68px, 11vw, 160px)",
  height: "auto",
  flexShrink: 0,

  [theme.breakpoints.down("sm")]: {
    width: 52,
  },
}));

const Wordmark = styled("h1")(({ theme }) => ({
  ...typography.heroWordmark,
  margin: 0,
  color: theme.colours.accent.primary,
  fontSize: "clamp(48px, 12.5vw, 180px)",
  lineHeight: 1,
  whiteSpace: "nowrap",

  [theme.breakpoints.down("sm")]: {
    fontSize: "clamp(36px, 12vw, 48px)",
  },
}));

const Subtitle = styled("p")(({ theme }) => ({
  ...typography.heroSubtitle,
  maxWidth: "100%",
  marginTop: theme.space.xxl,
  color: theme.colours.text.onImage,
  fontSize: "clamp(24px, 3.33vw, 48px)",
  lineHeight: 1.2,
  textAlign: "center",

  [theme.breakpoints.down("sm")]: {
    marginTop: theme.space.md,
    fontSize: 24,
    lineHeight: 1.25,
  },
}));

const SearchForm = styled("form")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  maxWidth: 1200,
  height: 80,
  marginTop: theme.space.xxl,
  border: `1px solid ${theme.colours.accent.primary}`,
  borderRadius: theme.radius.lg,
  overflow: "hidden",
  backgroundColor:
    theme.palette.mode === "dark"
      ? theme.colours.background.primary
      : theme.colours.surface.paper,

  "&:focus-within": {
    outline: `3px solid ${theme.colours.accent.secondary}`,
    outlineOffset: 3,
  },

  [theme.breakpoints.down("sm")]: {
    height: 40,
    marginTop: theme.space.xl,
    borderRadius: theme.radius.md,
  },
}));

const SearchInput = styled("input")(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  height: "100%",
  paddingInline: theme.space.lg,
  border: 0,
  outline: "none",
  background: "transparent",
  color: theme.colours.accent.primary,
  fontFamily: theme.typography.fontFamily,
  fontSize: 24,

  [theme.breakpoints.down("sm")]: {
    paddingInline: theme.space.md,
    fontSize: 16,
  },
}));

const SearchAction = styled("button")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: 80,
  padding: 0,
  flexShrink: 0,
  border: 0,
  backgroundColor: theme.colours.accent.primary,
  color:
    theme.palette.mode === "dark"
      ? theme.colours.neutral.black
      : theme.colours.neutral.white,
  cursor: "pointer",

  "& svg": {
    fontSize: theme.sizes.icon.lg,
  },

  [theme.breakpoints.down("sm")]: {
    width: 50,

    "& svg": {
      fontSize: theme.sizes.icon.md,
    },
  },
}));
