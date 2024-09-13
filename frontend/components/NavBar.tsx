"use client";

import { DarkMode } from "@mui/icons-material";
import GridIcon from "@mui/icons-material/GridViewRounded";
import MapIcon from "@mui/icons-material/Map";
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

const AppBar = styled(MuiAppBar)<MuiAppBarProps>(({ theme }) => ({
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
}));

export default NavBar;
