"use client"

import { orange, pink } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import ThemeProvider from "@mui/system/ThemeProvider";
import React from "react";

import NavBar from "../components/NavBar";
import SearchModal from "../components/SearchModal";

const theme = createTheme({
  palette: {
    primary: {
      main: orange[800],
    },
  },
});

const ClientLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <AppLayout>{children}</AppLayout>
    </ThemeProvider>
  )
}

/**
 * AppLayout is a separate component so we can make use of the providers in ClientLayout
 */
const AppLayout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [searchOpen, setSearchOpen] = React.useState(false);
  return (
    <>
      <NavBar drawerOpen={false} setCurrentBuilding={() => {}} setSearchOpen={setSearchOpen}/>
      <SearchModal open={searchOpen} setOpen={setSearchOpen}/>
      {children}
    </>
  )
}

export default ClientLayout;
