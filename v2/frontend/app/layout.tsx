"use client";

import "../styles/globals.css";
import "../styles/button.css";

import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { orange, pink } from "@mui/material/colors";
import { createTheme, styled } from "@mui/material/styles";
import Head from "next/head";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

import Branding from "../components/Branding";
import { Building } from "../types";
import ThemeProvider from "@mui/system/ThemeProvider";

export default function RootLayout({
                                     // Layouts must accept a children prop.
                                     // This will be populated with nested layouts or pages
                                     children,
                                   }: {
  children: React.ReactNode;
}) {

  const [showMap, setShowMap] = React.useState(false);
  const [buttonText, setButtonText] = React.useState<string>("Map View");

  const [currentBuilding, setCurrentBuilding] = React.useState<Building | null>(
    null,
  );
  const drawerOpen = !!currentBuilding;

  const path = usePathname();

  const handleShowMap = () => {
    setShowMap((currState) => !currState);
    setButtonText(buttonText == "Map View" ? "List View" : "Map View");
  };

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


  const router = useRouter();

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
    <body>
    <AppBar
      position="fixed"
      open={drawerOpen}
      sx={(theme) => ({
        borderBottom: "1px solid #e0e0e0",
        alignItems: "center",
        display: "flex",
        justifyContent: "space-between",
      })}
    >
      <div id={"header"}>
        <div id={"headerBranding"}>
          <Branding
            onClick={() => {
              setCurrentBuilding(null);
              router.push("/");
            }}
          />
        </div>
        {
          path != "/" ?
            <div id={"headerSearch"}>
              <div id={"headerButtons"}>
                <div className={"header-buttons"}>
                  {
                    path != "/browse" ?
                      <a className={"button-gradient"} style={{ display: "flex", width: "5rem", height: "3rem" }}
                         href={"/browse"} id={"FreeroomsCTA"}>
                        <p style={{ fontWeight: "600", fontSize: "0.9rem" }}>Browse</p>
                      </a>
                      : null
                  }
                  {
                    path != "/map" ?
                      <a className={"button-gradient"} style={{ gap: "1rem", width: "5rem", height: "3rem" }}
                         href={"/map"}
                         id={"FreeroomsCTA"}>
                        <p style={{ fontWeight: "600", fontSize: "0.9rem" }}>Map</p>
                      </a>
                      : null
                  }
                </div>
              </div>
            </div>
            : null
        }
      </div>
    </AppBar>
    <ThemeProvider theme={theme}>
      <div>
        {children}
      </div>
    </ThemeProvider>
    </body>
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
  padding: theme.spacing(2, 1),
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

const ButtonGroup = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  paddingRight: theme.spacing(2),
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

