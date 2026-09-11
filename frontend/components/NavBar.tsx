"use client";

import { DarkMode } from "@mui/icons-material";
import GridIcon from "@mui/icons-material/GridViewRounded";
import MapIcon from "@mui/icons-material/Map";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import SearchIcon from "@mui/icons-material/Search";
import MuiAppBar from "@mui/material/AppBar";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { DarkModeContext } from "app/clientLayout";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";

import { useDispatch } from "../redux/hooks";
import { openSearch } from "../redux/searchOpenSlice";
import Branding from "./Branding";
import IconButton from "./IconButton";

// This isn't actually enforced so update this if u change the navbar
export const navHeight = 65;

const NavBar: React.FC = () => {
  const dispatch = useDispatch();
  const path = usePathname();
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  return (
    <AppBar
      position="fixed"
      sx={{
        borderBottom: (theme) => `1px solid ${theme.colours.border.default}`,
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Branding />
      <Stack direction="row" sx={{ gap: (theme) => `${theme.space.sm}px` }}>
        <IconButton
          aria-label="Open search"
          onClick={() => dispatch(openSearch())}
        >
          <SearchIcon />
        </IconButton>
        <IconButton
          aria-label="Browse buildings"
          active={path === "/browse"}
          aria-current={path === "/browse" ? "page" : undefined}
          href="/browse"
        >
          <GridIcon />
        </IconButton>
        <IconButton
          aria-label="All rooms"
          active={path === "/allRooms"}
          aria-current={path === "/allRooms" ? "page" : undefined}
          href="/allRooms"
        >
          <MeetingRoomIcon />
        </IconButton>
        <IconButton
          aria-label="Go to map"
          active={path === "/map"}
          aria-current={path === "/map" ? "page" : undefined}
          href="/map"
        >
          <MapIcon />
        </IconButton>
        <IconButton
          aria-label={isDarkMode ? "Use light mode" : "Use dark mode"}
          aria-pressed={isDarkMode}
          active={isDarkMode}
          onClick={toggleDarkMode}
        >
          <DarkMode />
        </IconButton>
      </Stack>
    </AppBar>
  );
};

const AppBar = styled(MuiAppBar)<MuiAppBarProps>(({ theme }) => ({
  background: theme.colours.surface.appBar,
  color: theme.colours.text.primary,
  boxShadow: "none",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  paddingBlock: theme.space.xs,
  paddingInline: theme.space.md,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

export default NavBar;
