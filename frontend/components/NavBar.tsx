"use client";

import { DarkMode } from "@mui/icons-material";
import GridIcon from "@mui/icons-material/GridViewRounded";
import MapIcon from "@mui/icons-material/Map";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import SearchIcon from "@mui/icons-material/Search";

import MuiAppBar from "@mui/material/AppBar";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar/AppBar";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { DarkModeContext } from "app/clientLayout";
import { usePathname } from "next/navigation";
import React, { useContext } from "react";

import { useDispatch } from "../redux/hooks";
import { openSearch } from "../redux/searchOpenSlice";
import { drawerWidth } from "../views/BuildingDrawer";
import Branding from "./Branding";
import IconButton from "./IconButton";

interface NavBarProps {
  drawerOpen: boolean;
}

// This isn't actually enforced so update this if u change the navbar
export const navHeight = 65;

const NavBar: React.FC<NavBarProps> = ({ drawerOpen }) => {
  const dispatch = useDispatch();
  const path = usePathname();
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  return (
    <AppBar
      position="fixed"
      drawerOpen={drawerOpen}
      sx={{
        borderBottom: `1px solid ${isDarkMode ? "#2c2c2c" : "#e0e0e0"}`,
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Branding />
      <Stack direction="row" spacing={1}>
        <IconButton
          aria-label="Open search"
          onClick={() => dispatch(openSearch())}
        >
          <SearchIcon />
        </IconButton>
        <IconButton
          aria-label="Browse buildings"
          active={path === "/browse"}
          href="/browse"
        >
          <GridIcon />
        </IconButton>
        <IconButton
          aria-label="All rooms"
          active={path === "/allRooms"}
          href="/allRooms"
        >
          <MeetingRoomIcon />
        </IconButton>
        <IconButton aria-label="Go to map" active={path === "/map"} href="/map">
          <MapIcon />
        </IconButton>
        <IconButton active={isDarkMode} onClick={toggleDarkMode}>
          <DarkMode />
        </IconButton>
      </Stack>
    </AppBar>
  );
};

interface AppBarProps extends MuiAppBarProps {
  drawerOpen?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "drawerOpen",
})<AppBarProps>(({ theme, drawerOpen }) => ({
  background: theme.palette.background.default,
  color: theme.palette.getContrastText(theme.palette.background.default),
  boxShadow: "none",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0.5, 2),
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(drawerOpen && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default NavBar;
