"use client"

import GridIcon from "@mui/icons-material/GridViewRounded";
import MapIcon from "@mui/icons-material/Map";
import MuiAppBar from "@mui/material/AppBar";
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar/AppBar";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

import { Building } from "../types";
import Branding from "./Branding";
import IconButton from "./IconButton";

interface NavBarProps {
  setCurrentBuilding: (building: Building | null) => void;
  drawerOpen: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ setCurrentBuilding, drawerOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <AppBar
      position="sticky"
      open={drawerOpen}
      sx={{
        borderBottom: "1px solid #e0e0e0",
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div id={"headerBranding"}>
        <Branding
          onClick={() => {
            setCurrentBuilding(null);
            router.push("/");
          }}
        />
      </div>
      <Stack direction="row" spacing={1}>
        <IconButton
          aria-label="Browse buildings"
          onClick={() => router.push("/browse")}
        >
          <GridIcon/>
        </IconButton>
        <IconButton
          aria-label="Go to map"
          onClick={() => router.push("/map")}
        >
          <MapIcon/>
        </IconButton>
      </Stack>
    </AppBar>
  )
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const drawerWidth = 400;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.getContrastText(theme.palette.background.default),
  boxShadow: "none",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(1, 2),
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginRight: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default NavBar;
