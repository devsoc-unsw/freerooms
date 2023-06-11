"use client"

import { orange } from "@mui/material/colors";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import ThemeProvider from "@mui/system/ThemeProvider";
import React from "react";
import { Provider as ReduxProvider } from 'react-redux'

import NavBar from "../components/NavBar";
import SearchModal from "../components/SearchModal";
import store from '../redux/store'
import BuildingDrawer from "../views/BuildingDrawer";

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
      <CssBaseline />
      <ReduxProvider store={store}>
        <App>
          {children}
        </App>
      </ReduxProvider>
    </ThemeProvider>
  )
}

/**
 * App is a separate component so we can make use of the providers in ClientLayout
 */
const App: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <>
      <NavBar setSearchOpen={setSearchOpen}/>
      <SearchModal open={searchOpen} setOpen={setSearchOpen}/>
      {children}
      <BuildingDrawer/>
    </>
  )
}

export default ClientLayout;
