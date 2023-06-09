"use client"

import { orange, pink } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import ThemeProvider from "@mui/system/ThemeProvider";
import React from "react";

import NavBar from "../components/NavBar";

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

const ClientLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <App>{children}</App>
    </ThemeProvider>
  )
}

/**
 * App is a separate component so we can make use of the providers in ClientLayout
 */
const App: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <>
      <NavBar drawerOpen={false} setCurrentBuilding={() => {}}/>
      {children}
    </>
  )
}

export default ClientLayout;
