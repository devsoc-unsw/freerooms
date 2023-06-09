"use client";

import "../styles/globals.css";
import "../styles/button.css";

import GridIcon from '@mui/icons-material/GridViewRounded';
import MapIcon from '@mui/icons-material/Map';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import { orange, pink } from "@mui/material/colors";
import Stack from "@mui/material/Stack";
import { createTheme, styled } from "@mui/material/styles";
import ThemeProvider from "@mui/system/ThemeProvider";
import Head from "next/head";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

import Branding from "../components/Branding";
import IconButton from "../components/IconButton";
import { Building } from "../types";

export default function RootLayout({
 // Layouts must accept a children prop.
 // This will be populated with nested layouts or pages
 children,
}: {
  children: React.ReactNode;
}) {
  const [currentBuilding, setCurrentBuilding] = React.useState<Building | null>(
    null,
  );
  const drawerOpen = !!currentBuilding;

  const router = useRouter();

  const path = usePathname();

  return (
    <html lang="en">
    <Head>
      <title>Freerooms</title>
      <meta
        name="description"
        content="A web application designed to aid UNSW students in finding vacant rooms."
      />
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
    </Head>
    <ThemeProvider theme={theme}>
    <body>
    <AppBar
      position="sticky"
      open={drawerOpen}
      sx={(theme) => ({
        borderBottom: "1px solid #e0e0e0",
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
      })}
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
          href={path !== "/browse" ? "/browse" : undefined}
        >
          <GridIcon/>
        </IconButton>
        <IconButton
          aria-label="Go to map"
          href={path !== "/map" ? "/map" : undefined}
        >
          <MapIcon/>
        </IconButton>
      </Stack>
    </AppBar>
    {children}
    </body>
    </ThemeProvider>
    </html>
  );
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

const theme = createTheme({
  palette: {
    primary: {
      main: orange[800],
    },
    secondary: {
      main: pink[500],
    },
  },
});

